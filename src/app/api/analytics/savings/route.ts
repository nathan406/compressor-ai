/**
 * GET /api/analytics/savings
 * Returns savings broken down by day for the last 30 days.
 * Used by the Analytics page charts.
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

  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [promptLogs, routingLogs, contextLogs, jobs] = await Promise.all([
    prisma.promptLog.findMany({ where: { userId: user.userId, createdAt: { gte: since } } }),
    prisma.routingLog.findMany({ where: { userId: user.userId, createdAt: { gte: since } } }),
    prisma.contextLog.findMany({ where: { userId: user.userId, createdAt: { gte: since } } }),
    prisma.job.findMany({ where: { userId: user.userId, status: "completed", createdAt: { gte: since } }, include: { result: true } }),
  ]);

  // Build a map of date → savings per layer
  const dayMap: Record<string, { l1: number; l2: number; l3: number; l4: number }> = {};

  const addDay = (dateStr: string) => {
    if (!dayMap[dateStr]) dayMap[dateStr] = { l1: 0, l2: 0, l3: 0, l4: 0 };
  };

  jobs.forEach((j) => {
    const d = j.createdAt.toISOString().slice(0, 10);
    addDay(d);
    dayMap[d].l1 += j.savings;
  });
  promptLogs.forEach((l) => {
    const d = l.createdAt.toISOString().slice(0, 10);
    addDay(d);
    dayMap[d].l2 += l.savedDollars;
  });
  routingLogs.forEach((l) => {
    const d = l.createdAt.toISOString().slice(0, 10);
    addDay(d);
    dayMap[d].l3 += l.savedDollars;
  });
  contextLogs.forEach((l) => {
    const d = l.createdAt.toISOString().slice(0, 10);
    addDay(d);
    dayMap[d].l4 += l.savedDollars;
  });

  const series = Object.entries(dayMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({
      date,
      layer1: parseFloat(v.l1.toFixed(2)),
      layer2: parseFloat(v.l2.toFixed(2)),
      layer3: parseFloat(v.l3.toFixed(2)),
      layer4: parseFloat(v.l4.toFixed(2)),
      total:  parseFloat((v.l1 + v.l2 + v.l3 + v.l4).toFixed(2)),
    }));

  return NextResponse.json({ series, days: series.length });
}
