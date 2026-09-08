/**
 * POST /api/optimize/system
 * Layer 2 (real) + Layers 1/3/4/5 (projected) — Full-System Compression.
 *
 * A visitor pastes a link to their AI product — a site, doc page, API
 * response, chat transcript, anything public. We fetch the real content,
 * measure its tokens, and compress it live with Claude Haiku (same engine
 * as the Prompt Optimizer). That real, measured Layer 2 result is then
 * used to project what the other four optimization layers would save
 * across their whole stack, using Compressor AI's published per-layer
 * savings ratios — so the demo shows their entire AI system compressing,
 * with Layer 2 always backed by a live measurement and the rest clearly
 * labeled as projections, not measurements.
 *
 * Body:   { url: string; model?: string }
 * 200:    { url, hostname, originalTokens, optimizedTokens, savedTokens,
 *            reductionPct, savedDollars, monthlySavings, source,
 *            sourcePreview, optimizedPreview,
 *            estimatedMonthlySpend, totalMonthlySavings, layers[] }
 */
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/middleware";
import { prisma } from "@/lib/db";
import { callClaudeHaiku } from "@/lib/claude";
import { estimateTokens, calcCost, DEFAULT_MODEL } from "@/lib/pricing";
import { fetchPublicUrlAsText, UrlFetchError, type FetchedSource } from "@/lib/urlFetch";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

// Published per-layer share of total spend a fully-optimized stack recovers.
// L2 is replaced with the real measured reduction for this request; the rest
// are projections, applied to an estimated monthly spend derived from the
// content we just measured. These match the ratios used in /api/optimize/scan
// so numbers stay consistent across the whole product.
const LAYER_RATIOS = {
  l1: 0.085,
  l3: 0.081,
  l4: 0.074,
  l5: 0.228,
};

// Assumed call volume used to extrapolate a single measurement into a
// monthly figure — same assumption used by /api/optimize/prompt.
const CALLS_PER_MONTH = 30 * 1000;

export async function POST(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body  = await req.json().catch(() => ({}));
  const url   = String(body.url ?? "").trim();
  const model = String(body.model ?? DEFAULT_MODEL);

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // ── Fetch + extract real content ──────────────────────────────
  let fetched: FetchedSource;
  try {
    fetched = await fetchPublicUrlAsText(url);
  } catch (err) {
    const message = err instanceof UrlFetchError ? err.message : "Couldn't process that URL.";
    await prisma.systemCompression.create({
      data: {
        userId: user.userId,
        url,
        status: "failed",
        errorMessage: message,
      },
    }).catch(() => {});
    return NextResponse.json({ error: message }, { status: 422 });
  }

  const originalTokens = estimateTokens(fetched.text);

  // ── Layer 2 — real compression via Claude Haiku ───────────────
  const systemPrompt = `You are the Layer 2 compression engine for Compressor AI — the AI Efficiency Operating System.
You have just fetched real content from a live URL. Rewrite it to be as concise as possible while preserving every fact, number, and piece of meaning that matters.
Remove filler words, marketing fluff, redundant phrasing, and repeated boilerplate.
Return ONLY the compressed text with no explanation, no preamble, and no quotation marks.`;

  const fallbackCompressed = fetched.text
    .replace(/\s+/g, " ")
    .replace(/\b(please note that|it is important to note|in order to|as well as|kindly|please )\b/gi, "")
    .trim();

  const { text: optimizedText, source } = await callClaudeHaiku(
    `${systemPrompt}\n\nContent fetched from ${fetched.url}:\n\n${fetched.text}`,
    fallbackCompressed,
    1024
  );

  const optimizedTokens = estimateTokens(optimizedText);
  const savedTokens     = Math.max(originalTokens - optimizedTokens, 0);
  const reductionPct    = originalTokens > 0
    ? Math.round((savedTokens / originalTokens) * 100)
    : 0;
  const savedDollarsPerCall = calcCost(savedTokens, model);
  const monthlySavings      = parseFloat((savedDollarsPerCall * CALLS_PER_MONTH).toFixed(2));

  // ── Project the whole-system number off this real measurement ─
  const estimatedMonthlySpend = Math.max(
    parseFloat((calcCost(originalTokens, model) * CALLS_PER_MONTH).toFixed(2)),
    500 // floor so tiny pages still produce a sane demo number
  );

  const layers = [
    {
      layer:     "L1 — Model Optimization",
      status:    "projected",
      detail:    "Quantization + pruning applied to the models behind this endpoint.",
      saving:    Math.round(estimatedMonthlySpend * LAYER_RATIOS.l1),
      pct:       63,
    },
    {
      layer:     "L2 — Prompt Optimization",
      status:    "measured",
      detail:    `${fetched.hostname} content: ${originalTokens.toLocaleString()} → ${optimizedTokens.toLocaleString()} tokens, live.`,
      saving:    Math.round(monthlySavings),
      pct:       reductionPct,
    },
    {
      layer:     "L3 — Smart Routing",
      status:    "projected",
      detail:    "Simple traffic to this system rerouted to cheaper models.",
      saving:    Math.round(estimatedMonthlySpend * LAYER_RATIOS.l3),
      pct:       75,
    },
    {
      layer:     "L4 — Context Compression",
      status:    "projected",
      detail:    "Conversation / session history compressed before each call.",
      saving:    Math.round(estimatedMonthlySpend * LAYER_RATIOS.l4),
      pct:       85,
    },
    {
      layer:     "L5 — Inference Network",
      status:    "projected",
      detail:    "Idle GPU capacity behind this system reclaimed and rebalanced.",
      saving:    Math.round(estimatedMonthlySpend * LAYER_RATIOS.l5),
      pct:       34,
    },
  ];

  const totalMonthlySavings = layers.reduce((sum, l) => sum + l.saving, 0);

  const sourcePreview    = fetched.text.slice(0, 600);
  const optimizedPreview = optimizedText.slice(0, 600);

  await prisma.systemCompression.create({
    data: {
      userId:                user.userId,
      url:                   fetched.url,
      hostname:               fetched.hostname,
      status:                "completed",
      originalTokens,
      optimizedTokens,
      savedTokens,
      reductionPct,
      savedDollars:           parseFloat(savedDollarsPerCall.toFixed(6)),
      source,
      sourcePreview,
      optimizedPreview,
      estimatedMonthlySpend,
      totalMonthlySavings,
      layersJson:             JSON.stringify(layers),
    },
  }).catch(() => {});

  return NextResponse.json({
    url:              fetched.url,
    hostname:         fetched.hostname,
    originalTokens,
    optimizedTokens,
    savedTokens,
    reductionPct,
    savedDollars:     parseFloat(savedDollarsPerCall.toFixed(6)),
    monthlySavings,
    source,
    sourcePreview,
    optimizedPreview,
    estimatedMonthlySpend,
    totalMonthlySavings,
    layers,
    layer: "Full-System Compression (Layer 2 measured, Layers 1/3/4/5 projected)",
  });
}
