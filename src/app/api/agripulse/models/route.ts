/**
 * GET /api/agripulse/models
 * Lists all models deployed to AgriPulse for the authenticated user,
 * each with its original-vs-optimized infrastructure comparison
 * (product spec §14).
 *
 * 200: [{ agriModel, edgeMetrics, infraComparison }]
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

  const agriModels = await prisma.agriModel.findMany({
    where:   { userId: user.userId },
    orderBy: { deployedAt: "desc" },
    include: { job: { include: { result: true } } },
  });

  const withComparisons = agriModels
    .filter((m) => m.job.result)
    .map((m) => {
      const edgeMetrics = computeEdgeMetrics(m.job.result!);
      return {
        agriModel: m,
        edgeMetrics,
        infraComparison: buildInfraComparison(m.job.result!, edgeMetrics),
      };
    });

  return NextResponse.json(withComparisons);
}
