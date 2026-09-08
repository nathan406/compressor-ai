/**
 * GET    /api/jobs/[id]  — fetch one job
 * PATCH  /api/jobs/[id]  — update status / progress / log / savings
 * DELETE /api/jobs/[id]  — remove a job
 */
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/middleware";
import { prisma } from "@/lib/db";

type Ctx = { params: { id: string } };

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function GET(req: NextRequest, ctx: Ctx) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const job = await prisma.job.findFirst({
    where:   { id: Number(ctx.params.id), userId: user.userId },
    include: { result: true },
  });

  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  return NextResponse.json(job);
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.job.findFirst({
    where: { id: Number(ctx.params.id), userId: user.userId },
  });
  if (!existing) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));

  // Only these fields are allowed to be updated
  const ALLOWED = ["status", "progress", "log", "savings", "outputSize",
                   "modelInputPath", "modelOutputPath"] as const;
  const data: Record<string, unknown> = {};
  for (const key of ALLOWED) {
    if (key in body) data[key] = body[key];
  }

  // If completing the job, also upsert the result record
  if (body.status === "completed" && body.result) {
    await prisma.jobResult.upsert({
      where:  { jobId: Number(ctx.params.id) },
      create: { jobId: Number(ctx.params.id), ...body.result },
      update: body.result,
    });
  }

  const updated = await prisma.job.update({
    where:   { id: Number(ctx.params.id) },
    data,
    include: { result: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.job.findFirst({
    where: { id: Number(ctx.params.id), userId: user.userId },
  });
  if (!existing) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  await prisma.job.delete({ where: { id: Number(ctx.params.id) } });
  return NextResponse.json({ deleted: Number(ctx.params.id) });
}
