/**
 * GET /api/health
 * ─────────────────────────────────────────────────────────────────
 * Returns basic service status.
 */

import { NextResponse } from "next/server";
import { getJobCount } from "@/lib/db";

export async function GET() {
  let dbStatus: "ok" | "error" = "ok";
  try {
    const count = getJobCount();
    void count;
  } catch {
    dbStatus = "error";
  }

  return NextResponse.json({
    status:            "ok",
    claude_configured: Boolean(process.env.ANTHROPIC_API_KEY),
    claude_model:      process.env.CLAUDE_MODEL ?? "claude-sonnet-4-6",
    db:                dbStatus,
    ts:                Date.now(),
  });
}
