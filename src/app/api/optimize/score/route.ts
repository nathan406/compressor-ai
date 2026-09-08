/**
 * GET /api/optimize/score
 * Returns the AI Efficiency Score™ for the authenticated user,
 * calculated from real activity data across all 5 layers.
 * Also persists the score to the database for trend tracking.
 *
 * 200: { overall, costEfficiency, tokenEfficiency, latencyScore,
 *        contextEfficiency, gpuEfficiency, infrastructure,
 *        totalSavedDollars, jobsCompleted, ... }
 */
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/middleware";
import { prisma } from "@/lib/db";
import { calculateEfficiencyScore } from "@/lib/score";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function GET(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const scores = await calculateEfficiencyScore(user.userId);

  // Persist score snapshot for trend history
  await prisma.efficiencyScore.create({
    data: {
      userId:            user.userId,
      costEfficiency:    scores.costEfficiency,
      tokenEfficiency:   scores.tokenEfficiency,
      latencyScore:      scores.latencyScore,
      contextEfficiency: scores.contextEfficiency,
      gpuEfficiency:     scores.gpuEfficiency,
      infrastructure:    scores.infrastructure,
      overall:           scores.overall,
    },
  });

  // Fetch last 12 score snapshots for the trend chart
  const history = await prisma.efficiencyScore.findMany({
    where:   { userId: user.userId },
    orderBy: { calculatedAt: "desc" },
    take:    12,
    select:  { overall: true, calculatedAt: true },
  });

  return NextResponse.json({
    ...scores,
    grade:   scores.overall >= 90 ? "A+" : scores.overall >= 85 ? "A" : scores.overall >= 80 ? "A-" : scores.overall >= 75 ? "B+" : "B",
    history: history.reverse(),
  });
}
