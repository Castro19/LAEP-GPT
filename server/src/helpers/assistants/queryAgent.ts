import { environment, openai, queryAssistantId } from "../../index";
import { z } from "zod";

// Security-focused schema configuration
const ForbiddenPatterns = z.string().refine(
  // eslint-disable-next-line no-control-regex
  (val) => !/[;$\\|<>\\/\x00-\x1F]/.test(val),
  "Contains forbidden characters"
);

const MaxDepthSchema = z.any().superRefine((val, ctx) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const checkDepth = (obj: any, depth = 0): void => {
    if (depth > 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Object nesting too deep (max 5 levels)",
      });
    }

    if (typeof obj === "object" && obj !== null) {
      Object.values(obj).forEach((v) => checkDepth(v, depth + 1));
    }
  };

  checkDepth(val);
});

export const SafeQuerySchema = z
  .union([
    z.object({}).passthrough().and(MaxDepthSchema).and(ForbiddenPatterns),
    z.array(z.any()).max(100),
    z.record(z.any()),
  ])
  .refine(
    (data) => {
      const json = JSON.stringify(data);
      return json.length <= 5000 && !/(\\u0000|\\u001b|\\u009b)/.test(json);
    },
    { message: "Query exceeds security limits" }
  );

export type QueryResponse = {
  query: unknown;
  explanation?: string;
} | null;

export const queryAgent = async (text: string): Promise<QueryResponse> => {
  try {
    const run = await openai.beta.threads.createAndRun({
      assistant_id: queryAssistantId as string,
      thread: { messages: [{ role: "user", content: text }] },
    });

    let currentRun = run;
    let attempts = 0;
    const maxAttempts = 20;

    while (
      attempts < maxAttempts &&
      !["completed", "failed", "cancelled"].includes(currentRun.status)
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      currentRun = await openai.beta.threads.runs.retrieve(
        run.thread_id,
        currentRun.id
      );
      attempts++;
      if (environment === "dev") {
        console.log(`Polling attempt ${attempts}: ${currentRun.status}`);
      }
    }

    if (currentRun.status !== "completed") {
      console.error(`Run failed with status: ${currentRun.status}`);
      return null;
    }

    const messages = await openai.beta.threads.messages.list(run.thread_id);
    await openai.beta.threads.del(run.thread_id);

    for (const message of messages.data.reverse()) {
      if (message.role === "assistant" && message.content[0].type === "text") {
        const content = message.content[0].text.value;

        try {
          // Flexible JSON extraction
          const jsonString = content
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

          const parsed = JSON.parse(jsonString);

          // Security validation
          const safeData = SafeQuerySchema.parse(parsed);

          // Extract query from common patterns
          return {
            query: safeData.query ?? safeData.filter ?? safeData,
            explanation: safeData.explanation || safeData.description || "",
          };
        } catch (error) {
          console.error("Processing failed:", error);
          return {
            query: null,
            explanation: "Failed to parse response",
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Query agent error:", error);
    return null;
  }
};
