import { Run } from "openai/resources/beta/threads/runs/runs.js";

// Helper function to calculate cost (you can adjust rates as needed)
export function calculateCost(
  usage: Run.Usage,
  modelType: string
): {
  promptCost: string;
  completionCost: string;
  totalCost: string;
} {
  const PROMPT_TOKEN_RATE = modelType === "gpt-4o-mini" ? 0.00015 : 0.01; // per 1K tokens
  const COMPLETION_TOKEN_RATE = modelType === "gpt-4o-mini" ? 0.0006 : 0.00003; // per 1K tokens
  const promptCost = (usage.prompt_tokens / 1000) * PROMPT_TOKEN_RATE;
  const completionCost =
    (usage.completion_tokens / 1000) * COMPLETION_TOKEN_RATE;

  return {
    promptCost: promptCost.toFixed(6),
    completionCost: completionCost.toFixed(6),
    totalCost: (promptCost + completionCost).toFixed(6),
  };
}
