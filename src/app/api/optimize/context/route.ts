/**
 * POST /api/optimize/context
 * Layer 4 — Context Compression.
 * Takes a conversation history array, compresses it into a semantic summary,
 * and returns the compressed version with token savings.
 *
 * Body:   { messages: Array<{ role: string; content: string }>; model?: string }
 * 200:    { compressed, originalTokens, compressedTokens, savedTokens, reductionPct, savedDollars }
 */
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/middleware";
import { prisma } from "@/lib/db";
import { callClaudeHaiku } from "@/lib/claude";
import { estimateTokens, calcCost, DEFAULT_MODEL } from "@/lib/pricing";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body     = await req.json().catch(() => ({}));
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const model    = String(body.model ?? DEFAULT_MODEL);

  if (messages.length === 0) {
    return NextResponse.json({ error: "messages array is required and must not be empty" }, { status: 400 });
  }

  // Build the raw conversation text
  const conversationText = messages
    .map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
    .join("\n");

  const originalTokens = estimateTokens(conversationText);

  // Keep the last 2 messages intact — only compress earlier history
  const toCompress = messages.slice(0, -2);
  const recent     = messages.slice(-2);

  let compressedText = conversationText;
  let source: "claude" | "fallback" = "fallback";

  if (toCompress.length > 0) {
    const toCompressText = toCompress
      .map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
      .join("\n");

    const compressionPrompt = `You are a context compression engine for Compressor AI.
Compress the following conversation history into a concise semantic summary.
Preserve ALL key facts, decisions, user preferences, and important context.
The summary will replace the full conversation history to reduce token usage.
Return ONLY the compressed summary, no explanation.

Conversation to compress:
${toCompressText}`;

    const result = await callClaudeHaiku(
      compressionPrompt,
      `Summary: ${toCompressText.slice(0, 200)}...`, // fallback summary
      400
    );

    source = result.source;

    // Build the compressed messages array
    const compressedMessages = [
      { role: "system", content: `[Compressed context] ${result.text}` },
      ...recent,
    ];
    compressedText = compressedMessages
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");
  }

  const compressedTokens = estimateTokens(compressedText);
  const savedTokens      = Math.max(originalTokens - compressedTokens, 0);
  const reductionPct     = originalTokens > 0
    ? Math.round((savedTokens / originalTokens) * 100)
    : 0;
  const savedDollars = calcCost(savedTokens, model);

  await prisma.contextLog.create({
    data: {
      userId:          user.userId,
      originalTokens,
      compressedTokens,
      savedTokens,
      reductionPct,
      savedDollars,
      turnCount:       messages.length,
    },
  });

  return NextResponse.json({
    compressed:       compressedText,
    originalTokens,
    compressedTokens,
    savedTokens,
    reductionPct,
    savedDollars:    parseFloat(savedDollars.toFixed(6)),
    monthlySavings:  parseFloat((savedDollars * 30 * 500).toFixed(2)), // extrapolated to 500 sessions/day
    turnCount:       messages.length,
    source,
    layer:           "Layer 4 — Context Compression",
  });
}
