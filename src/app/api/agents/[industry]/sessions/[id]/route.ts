/**
 * GET /api/agents/[industry]/sessions/[id]
 * Fetch one agent session with its full message transcript.
 *
 * 200: AgentSession & { messages: AgentMessage[] }
 */
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/middleware";
import { prisma } from "@/lib/db";

type Ctx = { params: { industry: string; id: string } };

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function GET(req: NextRequest, ctx: Ctx) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const session = await prisma.agentSession.findFirst({
    where:   { id: Number(ctx.params.id), userId: user.userId, industry: ctx.params.industry },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

  return NextResponse.json({
    ...session,
    messages: session.messages.map((m: any) => ({
      ...m,
      toolCalls: m.toolCalls ? JSON.parse(m.toolCalls) : [],
    })),
  });
}
