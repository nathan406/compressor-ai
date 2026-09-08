/**
 * GET /api/agripulse/diagnoses
 * Crop diagnosis history for the authenticated user, most recent first.
 * Optional ?agriModelId=<id> to filter to one deployed model.
 *
 * 200: [CropDiagnosis]
 */
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/middleware";
import { prisma } from "@/lib/db";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function GET(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agriModelId = req.nextUrl.searchParams.get("agriModelId");

  const diagnoses = await prisma.cropDiagnosis.findMany({
    where: {
      userId: user.userId,
      ...(agriModelId ? { agriModelId: Number(agriModelId) } : {}),
    },
    orderBy: { createdAt: "desc" },
    take:    50,
  });

  return NextResponse.json(
    diagnoses.map((d: any) => ({
      ...d,
      possibleCauses: d.possibleCauses ? JSON.parse(d.possibleCauses) : [],
    }))
  );
}
