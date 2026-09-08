/**
 * POST /api/agents/[industry]/sessions — start a new session with one agent
 * GET  /api/agents/[industry]/sessions — list this user's sessions with that agent
 *
 * industry: agriculture | health | tourism | fintech | education |
 *           government | logistics | retail | energy
 *
 * 201/200: AgentSession | AgentSession[]
 */
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/middleware";
import { prisma } from "@/lib/db";
import { getAgent } from "@/lib/agents/registry";

type Ctx = { params: { industry: string } };

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agent = getAgent(ctx.params.industry);
  if (!agent) return NextResponse.json({ error: "Unknown agent industry" }, { status: 404 });

  const session = await prisma.agentSession.create({
    data: { userId: user.userId, industry: agent.id, status: "active" },
  });

  return NextResponse.json(session, { status: 201 });
}

export async function GET(req: NextRequest, ctx: Ctx) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agent = getAgent(ctx.params.industry);
  if (!agent) return NextResponse.json({ error: "Unknown agent industry" }, { status: 404 });

  const sessions = await prisma.agentSession.findMany({
    where:   { userId: user.userId, industry: agent.id },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(sessions);
}
