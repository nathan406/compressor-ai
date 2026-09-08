/**
 * POST /api/claude
 * Secure server-side proxy to the Anthropic API.
 * The API key never reaches the browser.
 * Falls back to client-supplied fallback text if the key is missing or the call fails.
 *
 * Body:   { prompt: string; fallback?: string; maxTokens?: number }
 * 200:    { text: string; source: "claude" | "fallback" }
 */
import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/claude";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(req: NextRequest) {
  try {
    const body      = await req.json().catch(() => ({}));
    const prompt    = String(body.prompt    ?? "").trim();
    const fallback  = String(body.fallback  ?? "");
    const maxTokens = Number(body.maxTokens ?? 1024);

    if (!prompt) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    const result = await callClaude(prompt, fallback, maxTokens);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/claude]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
