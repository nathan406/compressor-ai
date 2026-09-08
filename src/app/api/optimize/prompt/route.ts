/**
 * POST /api/optimize/prompt
 * Layer 2 — Prompt Optimization.
 * Takes a prompt, uses Claude Haiku to rewrite it shorter,
 * returns both versions with token counts and real dollar savings.
 *
 * Body:   { prompt: string; model?: string }
 * 200:    { original, optimized, originalTokens, optimizedTokens, savedTokens, reductionPct, savedDollars }
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

  const body   = await req.json().catch(() => ({}));
  const prompt = String(body.prompt ?? "").trim();
  const model  = String(body.model  ?? DEFAULT_MODEL);

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const originalTokens = estimateTokens(prompt);

  // Ask Claude Haiku to rewrite the prompt as concisely as possible
  const systemPrompt = `You are a prompt optimization engine for Compressor AI — the AI Efficiency Operating System. 
Your job is to rewrite the user's prompt to be as concise as possible while preserving 100% of the original meaning and intent.
Remove all filler words, redundant phrases, unnecessary politeness, and verbose instructions.
Return ONLY the rewritten prompt with no explanation, no preamble, and no quotation marks.`;

  const { text: optimizedPrompt, source } = await callClaudeHaiku(
    `${systemPrompt}\n\nOriginal prompt:\n${prompt}`,
    // Fallback: remove common filler phrases automatically
    prompt
      .replace(/please carefully|please |kindly |could you |would you |I would like you to /gi, "")
      .replace(/\s+/g, " ")
      .trim(),
    512
  );

  const optimizedTokens = estimateTokens(optimizedPrompt);
  const savedTokens     = Math.max(originalTokens - optimizedTokens, 0);
  const reductionPct    = originalTokens > 0
    ? Math.round((savedTokens / originalTokens) * 100)
    : 0;
  const savedDollars    = calcCost(savedTokens, model);

  // Persist to database for analytics and score calculation
  await prisma.promptLog.create({
    data: {
      userId:          user.userId,
      originalPrompt:  prompt,
      optimizedPrompt,
      originalTokens,
      optimizedTokens,
      savedTokens,
      reductionPct,
      savedDollars,
    },
  });

  return NextResponse.json({
    original:        prompt,
    optimized:       optimizedPrompt,
    originalTokens,
    optimizedTokens,
    savedTokens,
    reductionPct,
    savedDollars:    parseFloat(savedDollars.toFixed(6)),
    monthlySavings:  parseFloat((savedDollars * 30 * 1000).toFixed(2)), // extrapolated to 1k calls/day
    source,
    layer:           "Layer 2 — Prompt Optimization",
  });
}
