/**
 * GET /api/agents/sessions
 * Lists all AI Agent sessions for the authenticated user, across every
 * industry, most recent first. Use /api/agents/[industry]/sessions to
 * create or list sessions scoped to one agent.
 *
 * 200: [AgentSession] (without messages — fetch a session by id for its transcript)
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

  const sessions = await prisma.agentSession.findMany({
    where:   { userId: user.userId },
    orderBy: { updatedAt: "desc" },
    take:    50,
  });

  return NextResponse.json(sessions);
}
