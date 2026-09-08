/**
 * POST /api/agents/[industry]/sessions/[id]/message
 * Sends a user message to an agent session. Replays prior turns as
 * plain-text history, then runs the Claude tool-use loop (see
 * lib/agents/engine.ts) — the agent may call one or more of its
 * tools before replying. Persists both the user message and the
 * assistant reply (with its tool-call trace) to the session.
 *
 * Body:   { message: string }
 * 200:    { reply, steps, source, session }
 */
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/middleware";
import { prisma } from "@/lib/db";
import { getAgent } from "@/lib/agents/registry";
import { runAgentTurn, type AgentHistoryMessage } from "@/lib/agents/engine";

type Ctx = { params: { industry: string; id: string } };

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agent = getAgent(ctx.params.industry);
  if (!agent) return NextResponse.json({ error: "Unknown agent industry" }, { status: 404 });

  const sessionId = Number(ctx.params.id);
  const session = await prisma.agentSession.findFirst({
    where: { id: sessionId, userId: user.userId, industry: agent.id },
  });
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

  const body    = await req.json().catch(() => ({}));
  const message = String(body.message ?? "").trim();
  if (!message) return NextResponse.json({ error: "message is required" }, { status: 400 });

  // Replay prior turns as plain-text history for conversational context.
  const priorMessages = await prisma.agentMessage.findMany({
    where:   { sessionId },
    orderBy: { createdAt: "asc" },
  });
  const history: AgentHistoryMessage[] = priorMessages.map((m) => ({
    role:    m.role === "assistant" ? "assistant" : "user",
    content: m.content,
  }));

  const { reply, steps, source } = await runAgentTurn(agent.id, history, message);

  await prisma.agentMessage.create({
    data: { sessionId, role: "user", content: message },
  });
  const assistantMessage = await prisma.agentMessage.create({
    data: {
      sessionId,
      role:      "assistant",
      content:   reply,
      toolCalls: JSON.stringify(steps),
      source,
    },
  });
  const updatedSession = await prisma.agentSession.update({
    where: { id: sessionId },
    data:  { updatedAt: new Date() },
  });

  return NextResponse.json({
    reply,
    steps,
    source,
    messageId: assistantMessage.id,
    session: updatedSession,
  });
}
