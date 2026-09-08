/**
 * GET /api/agripulse/demo
 * Product spec §22 — "World Bank Demo Mode". Returns the full
 * Compresor AI → AgriPulse pipeline state in one call so a single
 * screen can walk a judge through:
 *   Original model → Optimize with Compresor AI → Compressed model
 *   → Deploy to AgriPulse → Upload crop image → Diagnosis
 *   → Infrastructure comparison
 *
 * Reads the user's most recently deployed AgriModel (create one first
 * via POST /api/agripulse/deploy) plus their recent crop diagnoses.
 *
 * 200: { stage, agriModel, edgeMetrics, infraComparison, recentDiagnoses }
 */
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/middleware";
import { prisma } from "@/lib/db";
import { computeEdgeMetrics, buildInfraComparison } from "@/lib/agripulse";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function GET(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agriModel = await prisma.agriModel.findFirst({
    where:   { userId: user.userId },
    orderBy: { deployedAt: "desc" },
    include: { job: { include: { result: true } } },
  });

  if (!agriModel || !agriModel.job.result) {
    return NextResponse.json({
      stage: "not_started",
      message:
        "No model deployed to AgriPulse yet. Create an optimization job, complete it, then POST /api/agripulse/deploy with its jobId.",
      agriModel: null,
      edgeMetrics: null,
      infraComparison: null,
      recentDiagnoses: [],
    });
  }

  const edgeMetrics = computeEdgeMetrics(agriModel.job.result);
  const infraComparison = buildInfraComparison(agriModel.job.result, edgeMetrics);

  const recentDiagnoses = await prisma.cropDiagnosis.findMany({
    where:   { userId: user.userId, agriModelId: agriModel.id },
    orderBy: { createdAt: "desc" },
    take:    5,
  });

  return NextResponse.json({
    stage: recentDiagnoses.length > 0 ? "diagnosed" : "deployed",
    agriModel,
    edgeMetrics,
    infraComparison,
    recentDiagnoses: recentDiagnoses.map((d: any) => ({
      ...d,
      possibleCauses: d.possibleCauses ? JSON.parse(d.possibleCauses) : [],
    })),
  });
}
