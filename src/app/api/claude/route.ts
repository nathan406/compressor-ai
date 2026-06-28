/**
 * POST /api/claude
 * ─────────────────────────────────────────────────────────────────
 * Secure server-side proxy to the Anthropic API.
 * The API key never reaches the browser.
 *
 * Body:   { prompt: string; fallback?: string }
 * 200:    { text: string; source: "claude" | "fallback" }
 *
 * If ANTHROPIC_API_KEY is not set, or the SDK call fails,
 * the endpoint returns the client-supplied fallback text so the
 * frontend always has something useful to display.
 */

import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY ?? "";
const CLAUDE_MODEL      = process.env.CLAUDE_MODEL ?? "claude-sonnet-4-6";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(req: NextRequest) {
  const body     = await req.json().catch(() => ({}));
  const prompt   = String(body.prompt   ?? "");
  const fallback = String(body.fallback ?? "");

  // ── No key configured → return fallback immediately ──────────
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json({ text: fallback, source: "fallback" });
  }

  // ── Call Claude via Anthropic REST API ────────────────────────
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type":         "application/json",
        "x-api-key":            ANTHROPIC_API_KEY,
        "anthropic-version":    "2023-06-01",
      },
      body: JSON.stringify({
        model:      CLAUDE_MODEL,
        max_tokens: 1024,
        messages:   [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("[claude proxy] API error:", response.status, err);
      return NextResponse.json({ text: fallback, source: "fallback" });
    }

    const data = await response.json();
    const text = (data.content as { type: string; text: string }[])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    return NextResponse.json({ text: text || fallback, source: "claude" });
  } catch (err) {
    console.error("[claude proxy] fetch error:", err);
    return NextResponse.json({ text: fallback, source: "fallback" });
  }
}
