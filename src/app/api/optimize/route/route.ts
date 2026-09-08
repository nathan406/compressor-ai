/**
 * POST /api/optimize/route
 * Layer 3 — Smart Model Routing.
 * Scores the complexity of a prompt and decides which model tier to route it to.
 * Returns the routing decision with before/after cost comparison.
 *
 * Body:   { prompt: string; defaultModel?: string }
 * 200:    { complexity, routedTo, provider, originalCost, actualCost, savedDollars, savingPct }
 */
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/middleware";
import { prisma } from "@/lib/db";
import {
  estimateTokens,
  calcCost,
  scoreComplexity,
  routingDecision,
  DEFAULT_MODEL,
} from "@/lib/pricing";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body         = await req.json().catch(() => ({}));
  const prompt       = String(body.prompt       ?? "").trim();
  const defaultModel = String(body.defaultModel ?? DEFAULT_MODEL);

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const tokens     = estimateTokens(prompt);
  const complexity = scoreComplexity(prompt);
  const decision   = routingDecision(complexity);

  const originalCost = calcCost(tokens, defaultModel);
  const actualCost   = calcCost(tokens, decision.model);
  const savedDollars = Math.max(originalCost - actualCost, 0);
  const savingPct    = originalCost > 0
    ? Math.round((savedDollars / originalCost) * 100)
    : 0;

  // Label complexity tier for the UI
  const complexityLabel =
    complexity <= 0.33 ? "Simple"  :
    complexity <= 0.66 ? "Medium"  : "Complex";

  // Persist routing decision
  await prisma.routingLog.create({
    data: {
      userId:        user.userId,
      prompt:        prompt.slice(0, 500), // store first 500 chars only
      complexity,
      routedTo:      decision.model,
      provider:      decision.provider,
      originalModel: defaultModel,
      originalCost,
      actualCost,
      savedDollars,
      latencyMs:     0, // real latency measured at inference time
    },
  });

  return NextResponse.json({
    tokens,
    complexity:       parseFloat(complexity.toFixed(3)),
    complexityLabel,
    originalModel:    defaultModel,
    routedTo:         decision.model,
    provider:         decision.provider,
    originalCost:     parseFloat(originalCost.toFixed(6)),
    actualCost:       parseFloat(actualCost.toFixed(6)),
    savedDollars:     parseFloat(savedDollars.toFixed(6)),
    savingPct,
    monthlySavings:   parseFloat((savedDollars * 30 * 1000).toFixed(2)),
    reasoning: `Request scored ${complexityLabel.toLowerCase()} complexity (${(complexity * 100).toFixed(0)}%). ` +
      `Routed to ${decision.model} via ${decision.provider} ` +
      `instead of ${defaultModel} — saving ${savingPct}% per call.`,
    layer: "Layer 3 — Smart Model Routing",
  });
}
