// Shared helper for calling the Anthropic API from any route.
// Falls back to the provided fallback string if the key is missing or the call fails.

const API_KEY = process.env.ANTHROPIC_API_KEY ?? "";
const MODEL   = process.env.CLAUDE_MODEL ?? "claude-sonnet-4-6";

export async function callClaude(
  prompt: string,
  fallback: string,
  maxTokens = 1024
): Promise<{ text: string; source: "claude" | "fallback" }> {
  if (!API_KEY) return { text: fallback, source: "fallback" };

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type":      "application/json",
        "x-api-key":         API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model:      MODEL,
        max_tokens: maxTokens,
        messages:   [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      console.error("[claude] API error", res.status, await res.text());
      return { text: fallback, source: "fallback" };
    }

    const data = await res.json();
    const text = (data.content as { type: string; text: string }[])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    return { text: text || fallback, source: "claude" };
  } catch (err) {
    console.error("[claude] fetch error", err);
    return { text: fallback, source: "fallback" };
  }
}

// Vision-capable call — used by AgriPulse Crop Health AI to analyze
// an uploaded/captured crop photo. Same fallback contract as callClaude.
export async function callClaudeVision(
  imageBase64: string,
  mediaType: string,
  prompt: string,
  fallback: string,
  maxTokens = 512
): Promise<{ text: string; source: "claude" | "fallback" }> {
  if (!API_KEY) return { text: fallback, source: "fallback" };

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type":      "application/json",
        "x-api-key":         API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model:      MODEL,
        max_tokens: maxTokens,
        messages: [
          {
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: mediaType, data: imageBase64 } },
              { type: "text", text: prompt },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      console.error("[claude vision] API error", res.status, await res.text());
      return { text: fallback, source: "fallback" };
    }

    const data = await res.json();
    const text = (data.content as { type: string; text: string }[])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    return { text: text || fallback, source: "claude" };
  } catch (err) {
    console.error("[claude vision] fetch error", err);
    return { text: fallback, source: "fallback" };
  }
}

// Full tool-use (agentic) call — used by the AI Agents framework
// (lib/agents/engine.ts). Accepts a message history and a tool
// schema, returns the raw content blocks so the engine can detect
// tool_use blocks and loop.
export interface AgentToolDef {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
}
export interface AgentContentBlock {
  type: string;
  text?: string;
  id?: string;
  name?: string;
  input?: Record<string, unknown>;
}

export async function callClaudeAgent(
  messages: Array<{ role: string; content: unknown }>,
  system: string,
  tools: AgentToolDef[],
  maxTokens = 800
): Promise<{ content: AgentContentBlock[]; stopReason: string; source: "claude" | "fallback" }> {
  if (!API_KEY) {
    return {
      content: [{ type: "text", text: "(Offline demo mode — set ANTHROPIC_API_KEY for live agent reasoning. This is a fallback response.)" }],
      stopReason: "end_turn",
      source: "fallback",
    };
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type":      "application/json",
        "x-api-key":         API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages, tools }),
    });

    if (!res.ok) {
      console.error("[claude agent] API error", res.status, await res.text());
      return {
        content: [{ type: "text", text: "The agent hit an error reaching Claude. Please try again." }],
        stopReason: "end_turn",
        source: "fallback",
      };
    }

    const data = await res.json();
    return { content: data.content as AgentContentBlock[], stopReason: data.stop_reason as string, source: "claude" };
  } catch (err) {
    console.error("[claude agent] fetch error", err);
    return {
      content: [{ type: "text", text: "The agent hit a network error. Please try again." }],
      stopReason: "end_turn",
      source: "fallback",
    };
  }
}

// Lightweight call using Haiku — cheaper, faster, ideal for Layers 2 & 4
export async function callClaudeHaiku(
  prompt: string,
  fallback: string,
  maxTokens = 512
): Promise<{ text: string; source: "claude" | "fallback" }> {
  if (!API_KEY) return { text: fallback, source: "fallback" };

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type":      "application/json",
        "x-api-key":         API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model:      "claude-haiku-4-5",
        max_tokens: maxTokens,
        messages:   [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) return { text: fallback, source: "fallback" };

    const data = await res.json();
    const text = (data.content as { type: string; text: string }[])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    return { text: text || fallback, source: "claude" };
  } catch {
    return { text: fallback, source: "fallback" };
  }
}
