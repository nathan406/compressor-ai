/**
 * POST /api/agripulse/diagnose
 * Product spec §7 — "Crop Health AI". A farmer (or demo judge) submits
 * a crop photo; AgriPulse returns a hedged, non-alarmist diagnosis and
 * defers to a human expert when confidence is low.
 *
 * Body:   { imageBase64: string; mediaType?: string; cropHint?: string; agriModelId?: number }
 * 200:    CropDiagnosis row
 */
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/middleware";
import { prisma } from "@/lib/db";
import { callClaudeVision } from "@/lib/claude";
import {
  DIAGNOSIS_CONFIDENCE_THRESHOLD,
  LOW_CONFIDENCE_MESSAGE,
} from "@/lib/agripulse";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

type DiagnosisPayload = {
  crop: string;
  possibleIssue: string;
  confidence: number;
  possibleCauses: string[];
  recommendation: string;
};

function parseDiagnosis(raw: string): DiagnosisPayload | null {
  try {
    const cleaned = raw.trim().replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    const parsed = JSON.parse(cleaned);
    if (typeof parsed.crop !== "string" || typeof parsed.possibleIssue !== "string") return null;
    return {
      crop: parsed.crop,
      possibleIssue: parsed.possibleIssue,
      confidence: Math.max(0, Math.min(100, Number(parsed.confidence) || 0)),
      possibleCauses: Array.isArray(parsed.possibleCauses) ? parsed.possibleCauses.map(String) : [],
      recommendation: String(parsed.recommendation ?? ""),
    };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body        = await req.json().catch(() => ({}));
  const imageBase64 = String(body.imageBase64 ?? "");
  const mediaType    = String(body.mediaType ?? "image/jpeg");
  const cropHint     = String(body.cropHint ?? "");
  const agriModelId  = body.agriModelId ? Number(body.agriModelId) : null;

  if (!imageBase64) {
    return NextResponse.json({ error: "imageBase64 is required" }, { status: 400 });
  }

  const prompt = `You are AgriPulse, an agricultural crop-health assistant for smallholder farmers in Africa.
Look at this crop photo${cropHint ? ` (farmer says the crop is: ${cropHint})` : ""} and respond with ONLY a JSON object, no other text, no markdown fences:

{
  "crop": "the crop you see, or the farmer's stated crop",
  "possibleIssue": "a hedged description, e.g. 'Possible nutrient deficiency' — never state a diagnosis as certain",
  "confidence": 0-100 integer,
  "possibleCauses": ["short cause 1", "short cause 2", "short cause 3"],
  "recommendation": "one short, practical, non-alarmist sentence a farmer can act on"
}

Rules:
- Never claim certainty. Always frame findings as "possible" / "may indicate".
- If the image is unclear, off-topic, or you genuinely cannot tell, set confidence below 50.
- Keep every field short — this is read on a basic phone screen.`;

  const fallback = JSON.stringify({
    crop: cropHint || "Maize",
    possibleIssue: "Possible leaf stress",
    confidence: 55,
    possibleCauses: ["Nutrient deficiency", "Water stress", "Early-stage pest damage"],
    recommendation: "Monitor over the next few days and ensure consistent watering.",
  });

  const { text, source } = await callClaudeVision(imageBase64, mediaType, prompt, fallback, 400);
  const parsed = parseDiagnosis(text) ?? parseDiagnosis(fallback)!;

  const lowConfidence = parsed.confidence < DIAGNOSIS_CONFIDENCE_THRESHOLD;
  const recommendation = lowConfidence ? LOW_CONFIDENCE_MESSAGE : parsed.recommendation;

  const diagnosis = await prisma.cropDiagnosis.create({
    data: {
      userId:         user.userId,
      agriModelId,
      cropHint,
      crop:           parsed.crop,
      possibleIssue:  parsed.possibleIssue,
      confidence:     parsed.confidence,
      lowConfidence,
      possibleCauses: JSON.stringify(parsed.possibleCauses),
      recommendation,
      source,
    },
  });

  return NextResponse.json({
    ...diagnosis,
    possibleCauses: parsed.possibleCauses,
  });
}
