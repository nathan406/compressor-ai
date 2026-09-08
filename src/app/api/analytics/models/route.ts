/**
 * GET /api/analytics/models
 * Returns per-model cost and savings breakdown.
 * Used by the Cost Intelligence page.
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

  const [jobs, routingLogs] = await Promise.all([
    prisma.job.findMany({
      where:   { userId: user.userId, status: "completed" },
      include: { result: true },
    }),
    prisma.routingLog.findMany({ where: { userId: user.userId } }),
  ]);

  // Aggregate job results by model name
  const modelMap: Record<string, {
    jobCount: number;
    totalSavings: number;
    avgCompressionRatio: number;
    avgSpeedup: number;
  }> = {};

  jobs.forEach((j: any) => {
    if (!modelMap[j.modelName]) {
      modelMap[j.modelName] = { jobCount: 0, totalSavings: 0, avgCompressionRatio: 0, avgSpeedup: 0 };
    }
    modelMap[j.modelName].jobCount++;
    modelMap[j.modelName].totalSavings += j.savings;
    modelMap[j.modelName].avgCompressionRatio += j.result?.compressionRatio ?? 0;
    modelMap[j.modelName].avgSpeedup += j.result?.speedupFactor ?? 0;
  });

  const modelStats = Object.entries(modelMap).map(([name, v]) => ({
    name,
    jobCount:            v.jobCount,
    totalSavings:        parseFloat(v.totalSavings.toFixed(2)),
    avgCompressionRatio: parseFloat((v.avgCompressionRatio / v.jobCount).toFixed(2)),
    avgSpeedup:          parseFloat((v.avgSpeedup / v.jobCount).toFixed(2)),
  }));

  // Routing breakdown by model
  const routingMap: Record<string, { count: number; totalSaved: number }> = {};
  routingLogs.forEach((l: any) => {
    if (!routingMap[l.routedTo]) routingMap[l.routedTo] = { count: 0, totalSaved: 0 };
    routingMap[l.routedTo].count++;
    routingMap[l.routedTo].totalSaved += l.savedDollars;
  });

  const routingStats = Object.entries(routingMap).map(([model, v]) => ({
    model,
    requestCount: v.count,
    totalSaved:   parseFloat(v.totalSaved.toFixed(2)),
  }));

  return NextResponse.json({ modelStats, routingStats });
}
