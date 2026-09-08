/**
 * POST /api/agripulse/deploy
 * Product spec §13/§22 — "Deploy to AgriPulse". Takes a completed
 * Compresor AI optimization Job and deploys its optimized model into
 * AgriPulse, computing the real connectivity/RAM profile from that
 * job's benchmark (see lib/agripulse.ts).
 *
 * Body:   { jobId: number; cropType?: string }
 * 200:    { agriModel, edgeMetrics, infraComparison }
 */
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/middleware";
import { prisma } from "@/lib/db";
import { computeEdgeMetrics, buildInfraComparison } from "@/lib/agripulse";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body     = await req.json().catch(() => ({}));
  const jobId    = Number(body.jobId ?? 0);
  const cropType = String(body.cropType ?? "maize");

  if (!jobId) {
    return NextResponse.json({ error: "jobId is required" }, { status: 400 });
  }

  const job = await prisma.job.findFirst({
    where:   { id: jobId, userId: user.userId },
    include: { result: true },
  });

  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  if (job.status !== "completed" || !job.result) {
    return NextResponse.json(
      { error: "Job must be completed with a result before it can be deployed to AgriPulse" },
      { status: 409 }
    );
  }

  const edgeMetrics = computeEdgeMetrics(job.result);

  const agriModel = await prisma.agriModel.upsert({
    where:  { jobId },
    create: {
      userId:        user.userId,
      jobId,
      cropType,
      connectivity:  edgeMetrics.connectivity,
      ramRequiredGB: edgeMetrics.ramRequiredGB,
      status:        "deployed",
    },
    update: {
      cropType,
      connectivity:  edgeMetrics.connectivity,
      ramRequiredGB: edgeMetrics.ramRequiredGB,
      status:        "deployed",
    },
    include: { job: { include: { result: true } } },
  });

  const infraComparison = buildInfraComparison(job.result, edgeMetrics);

  return NextResponse.json({ agriModel, edgeMetrics, infraComparison }, { status: 201 });
}
