// The agent engine: runs one turn of a Claude tool-use conversation
// for a given industry agent. Claude decides whether to call a tool;
// if it does, we execute the deterministic tool locally, feed the
// result back, and let Claude respond — looping up to MAX_STEPS times
// so multi-tool reasoning (e.g. "check risk, then explain") works.
import { callClaudeAgent, type AgentContentBlock } from "@/lib/claude";
import { getAgent } from "./registry";
import { runTool } from "./tools";

const MAX_STEPS = 3;

export interface AgentTurnStep {
  tool: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
}

export interface AgentTurnResult {
  reply: string;
  steps: AgentTurnStep[];
  source: "claude" | "fallback";
}

export type AgentHistoryMessage = { role: "user" | "assistant"; content: unknown };

export async function runAgentTurn(
  industry: string,
  history: AgentHistoryMessage[],
  userMessage: string
): Promise<AgentTurnResult> {
  const agent = getAgent(industry);
  if (!agent) {
    return { reply: `Unknown agent: ${industry}`, steps: [], source: "fallback" };
  }

  const messages: AgentHistoryMessage[] = [...history, { role: "user", content: userMessage }];
  const steps: AgentTurnStep[] = [];
  let source: "claude" | "fallback" = "fallback";

  for (let i = 0; i < MAX_STEPS; i++) {
    const { content, stopReason, source: turnSource } = await callClaudeAgent(
      messages,
      agent.systemPrompt,
      agent.tools,
      700
    );
    source = turnSource;

    const toolUses = content.filter((b) => b.type === "tool_use");

    if (stopReason !== "tool_use" || toolUses.length === 0) {
      const text = content
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("\n")
        .trim();
      return { reply: text || "I wasn't able to generate a response.", steps, source };
    }

    messages.push({ role: "assistant", content });

    const toolResults = toolUses.map((tu) => {
      const input = (tu.input as Record<string, unknown>) ?? {};
      const output = runTool(tu.name ?? "", input);
      steps.push({ tool: tu.name ?? "unknown", input, output });
      return { type: "tool_result", tool_use_id: tu.id, content: JSON.stringify(output) };
    });

    messages.push({ role: "user", content: toolResults });
  }

  return { reply: "The agent reached its maximum reasoning steps for this turn.", steps, source };
}

export type { AgentContentBlock };
