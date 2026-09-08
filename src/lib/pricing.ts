// Token pricing per 1,000 input tokens for each model/provider.
// Used across Layer 2, 3, 4 to calculate real dollar savings.

export const MODEL_PRICING: Record<string, { costPer1kTokens: number; provider: string }> = {
  // Premium
  "claude-sonnet-4-6": { costPer1kTokens: 0.003,   provider: "anthropic" },
  "claude-opus-4-6":   { costPer1kTokens: 0.015,   provider: "anthropic" },
  "gpt-4o":            { costPer1kTokens: 0.005,   provider: "openai" },
  "gpt-4-turbo":       { costPer1kTokens: 0.010,   provider: "openai" },
  // Mid
  "llama-3-70b":       { costPer1kTokens: 0.0009,  provider: "together" },
  "mistral-8x7b":      { costPer1kTokens: 0.0006,  provider: "together" },
  // Cheap
  "llama-3-8b":        { costPer1kTokens: 0.0002,  provider: "together" },
  "gemma-7b":          { costPer1kTokens: 0.0002,  provider: "together" },
  "phi-3-mini":        { costPer1kTokens: 0.00008, provider: "groq" },
  "claude-haiku-4-5":  { costPer1kTokens: 0.00025, provider: "anthropic" },
};

export const DEFAULT_MODEL = "claude-sonnet-4-6";

// Rough token estimate: ~1.3 tokens per word
export const estimateTokens = (text: string): number =>
  Math.ceil(text.split(/\s+/).filter(Boolean).length * 1.3);

export const calcCost = (tokens: number, model: string): number => {
  const p = MODEL_PRICING[model] ?? { costPer1kTokens: 0.003 };
  return (tokens / 1000) * p.costPer1kTokens;
};

// Complexity thresholds for Layer 3 routing
export const THRESHOLDS = { SIMPLE: 0.33, MEDIUM: 0.66 };

export type RoutingResult = {
  model: string;
  provider: string;
  costPer1kTokens: number;
};

export function routingDecision(complexityScore: number): RoutingResult {
  if (complexityScore <= THRESHOLDS.SIMPLE) {
    return { model: "phi-3-mini",        provider: "groq",      costPer1kTokens: 0.00008 };
  }
  if (complexityScore <= THRESHOLDS.MEDIUM) {
    return { model: "llama-3-70b",       provider: "together",  costPer1kTokens: 0.0009  };
  }
  return   { model: "claude-sonnet-4-6", provider: "anthropic", costPer1kTokens: 0.003   };
}

// Score how complex a prompt is (0.0 – 1.0)
export function scoreComplexity(prompt: string): number {
  const words   = prompt.split(/\s+/).filter(Boolean).length;
  const hasCode = /```|function |class |def |import |SELECT |FROM /i.test(prompt);
  const hasDeep = /analyz|compar|evaluat|critic|summariz|explain|research/i.test(prompt);
  const hasMulti = (prompt.match(/\?/g) ?? []).length > 2;

  let score = Math.min(words / 400, 0.5);
  if (hasCode)  score += 0.25;
  if (hasDeep)  score += 0.15;
  if (hasMulti) score += 0.10;

  return Math.min(score, 1.0);
}
