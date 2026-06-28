/**
 * GET  /api/jobs        — list all jobs (oldest first)
 * POST /api/jobs        — create a new job
 */

import { NextRequest, NextResponse } from "next/server";
import { getAllJobs, getJobById, createJob, type JobRow } from "@/lib/db";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function GET() {
  const rows = getAllJobs();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  // If the frontend supplies an explicit id (client-generated),
  // check whether it already exists to avoid duplicates.
  if (body.id != null) {
    const existing = getJobById(body.id);
    if (existing) return NextResponse.json(existing);
  }

  const newRow = createJob(body);
  return NextResponse.json(newRow, { status: 201 });
}
