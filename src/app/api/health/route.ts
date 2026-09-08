/**
 * GET /api/health
 * Service health check — verifies DB connection and reports Claude configuration.
 * Used by Netlify health checks and the frontend status indicator.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function GET() {
  let dbStatus: "ok" | "error" = "ok";
  let userCount = 0;

  try {
    userCount = await prisma.user.count();
  } catch {
    dbStatus = "error";
  }

  return NextResponse.json({
    status:            "ok",
    db:                dbStatus,
    userCount,
    claudeConfigured:  Boolean(process.env.ANTHROPIC_API_KEY),
    claudeModel:       process.env.CLAUDE_MODEL ?? "claude-sonnet-4-6",
    r2Configured:      Boolean(process.env.R2_ENDPOINT && process.env.R2_ACCESS_KEY),
    ts:                Date.now(),
    version:           "3.0.0",
    platform:          "Compressor AI — AI Efficiency Operating System",
  });
}
