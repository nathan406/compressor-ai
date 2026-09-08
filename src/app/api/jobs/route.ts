/**
 * GET  /api/jobs  — list all jobs for the authenticated user
 * POST /api/jobs  — create a new optimization job
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

  const jobs = await prisma.job.findMany({
    where:   { userId: user.userId },
    orderBy: { createdAt: "asc" },
    include: { result: true },
  });

  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));

  const job = await prisma.job.create({
    data: {
      userId:       user.userId,
      modelName:    String(body.modelName    ?? "Unknown Model"),
      params:       String(body.params       ?? ""),
      arch:         String(body.arch         ?? "transformer"),
      strategy:     String(body.strategy     ?? "quantization_int8"),
      priority:     String(body.priority     ?? "normal"),
      gpuLogs:      String(body.gpuLogs      ?? ""),
      latency:      String(body.latency      ?? ""),
      originalSize: Number(body.originalSize ?? 0),
      status:       "pending",
      progress:     0,
      log:          "",
      savings:      0,
    },
    include: { result: true },
  });

  return NextResponse.json(job, { status: 201 });
}
