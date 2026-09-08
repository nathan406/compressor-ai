/**
 * GET /api/analytics
 * Returns aggregated savings and activity data for the Overview dashboard.
 * All numbers come from real database records — no hardcoded values.
 *
 * 200: { totalSavings, byLayer, jobsCompleted, promptsOptimized, ... }
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

  const [jobs, promptLogs, routingLogs, contextLogs] = await Promise.all([
    prisma.job.findMany({
      where:   { userId: user.userId, status: "completed" },
      include: { result: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.promptLog.findMany({
      where:   { userId: user.userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.routingLog.findMany({
      where:   { userId: user.userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.contextLog.findMany({
      where:   { userId: user.userId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Layer savings
  const layer1Savings = jobs.reduce((s, j) => s + j.savings, 0);
  const layer2Savings = promptLogs.reduce((s, l) => s + l.savedDollars, 0);
  const layer3Savings = routingLogs.reduce((s, l) => s + l.savedDollars, 0);
  const layer4Savings = contextLogs.reduce((s, l) => s + l.savedDollars, 0);
  const totalSavings  = layer1Savings + layer2Savings + layer3Savings + layer4Savings;

  // Token stats
  const totalOriginalTokens  = promptLogs.reduce((s, l) => s + l.originalTokens, 0);
  const totalOptimizedTokens = promptLogs.reduce((s, l) => s + l.optimizedTokens, 0);
  const avgReductionPct      = promptLogs.length > 0
    ? promptLogs.reduce((s, l) => s + l.reductionPct, 0) / promptLogs.length
    : 0;

  // Routing stats
  const avgComplexity = routingLogs.length > 0
    ? routingLogs.reduce((s, l) => s + l.complexity, 0) / routingLogs.length
    : 0;
  const routingByModel = routingLogs.reduce<Record<string, number>>((acc, l) => {
    acc[l.routedTo] = (acc[l.routedTo] ?? 0) + 1;
    return acc;
  }, {});

  // Context stats
  const avgContextReduction = contextLogs.length > 0
    ? contextLogs.reduce((s, l) => s + l.reductionPct, 0) / contextLogs.length
    : 0;

  // Recent jobs for the dashboard table
  const recentJobs = jobs.slice(0, 10).map((j) => ({
    id:          j.id,
    modelName:   j.modelName,
    strategy:    j.strategy,
    status:      j.status,
    progress:    j.progress,
    savings:     j.savings,
    createdAt:   j.createdAt,
  }));

  return NextResponse.json({
    totalSavings: parseFloat(totalSavings.toFixed(2)),
    byLayer: {
      layer1: parseFloat(layer1Savings.toFixed(2)),
      layer2: parseFloat(layer2Savings.toFixed(2)),
      layer3: parseFloat(layer3Savings.toFixed(2)),
      layer4: parseFloat(layer4Savings.toFixed(2)),
      layer5: 0, // Layer 5 Inference Network — not yet implemented
    },
    jobs: {
      total:     jobs.length,
      completed: jobs.filter((j) => j.status === "completed").length,
      running:   jobs.filter((j) => j.status === "running").length,
      pending:   jobs.filter((j) => j.status === "pending").length,
      recent:    recentJobs,
    },
    prompts: {
      total:             promptLogs.length,
      totalOriginalTokens,
      totalOptimizedTokens,
      totalSavedTokens:  totalOriginalTokens - totalOptimizedTokens,
      avgReductionPct:   parseFloat(avgReductionPct.toFixed(1)),
    },
    routing: {
      total:         routingLogs.length,
      avgComplexity: parseFloat(avgComplexity.toFixed(3)),
      byModel:       routingByModel,
    },
    context: {
      total:              contextLogs.length,
      avgReductionPct:    parseFloat(avgContextReduction.toFixed(1)),
    },
  });
}
