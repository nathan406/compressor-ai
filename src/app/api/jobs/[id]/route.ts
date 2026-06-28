/**
 * GET    /api/jobs/[id]   — fetch one job
 * PATCH  /api/jobs/[id]   — update status / progress / log / savings
 * DELETE /api/jobs/[id]   — remove a job
 */

import { NextRequest, NextResponse } from "next/server";
import { getJobById, updateJob, deleteJob, type JobRow } from "@/lib/db";

type Params = { params: { id: string } };

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function GET(_req: NextRequest, { params }: Params) {
  const row = getJobById(Number(params.id));

  if (!row) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }
  return NextResponse.json(row);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const id   = Number(params.id);
  const body = await req.json().catch(() => ({}));

  const existing = getJobById(id);
  if (!existing) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  // Only allow updating these fields
  const ALLOWED = ["status", "progress", "log", "savings"] as const;
  const updates: Partial<Pick<JobRow, (typeof ALLOWED)[number]>> = {};

  for (const key of ALLOWED) {
    if (key in body) (updates as any)[key] = body[key];
  }

  if (Object.keys(updates).length > 0) {
    updateJob(id, updates);
  }

  const updated = getJobById(id)!;
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const id = Number(params.id);
  const deleted = deleteJob(id);

  if (!deleted) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json({ deleted: id });
}
