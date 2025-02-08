import { Run } from "openai/resources/beta/threads/runs/runs";
import { environment, openai, queryAssistantId } from "../../index";
import { z } from "zod";

// Define allowed MongoDB operators for enhanced security
const allowedOperators = [
  "$and",
  "$or",
  "$in",
  "$eq",
  "$ne",
  "$gt",
  "$gte",
  "$lt",
  "$lte",
] as const;

// Enhanced QuerySchema with operator restrictions
export const QuerySchema = z
  .object({
    $and: z
      .array(z.record(z.any()))
      .max(10, "Maximum of 10 conditions allowed in $and")
      .optional(),
    $or: z
      .array(z.record(z.any()))
      .max(10, "Maximum of 10 conditions allowed in $or")
      .optional(),
  })
  .catchall(
    z.record(z.any()).refine(
      (obj) => {
        // Ensure only allowed operators are used
        return Object.keys(obj).every((key) =>
          allowedOperators.includes(key as any)
        );
      },
      {
        message: `Only the following operators are allowed: ${allowedOperators.join(", ")}`,
      }
    )
  )
  .refine((data) => Object.keys(data).length > 0, {
    message: "Query cannot be empty",
  });

// Define the schema for responses that include both query and explanation
const StructuredResponseSchema = z.object({
  query: QuerySchema,
  explanation: z.string().max(200),
});

// Define the schema for simple queries without explanation
const SimpleQuerySchema = QuerySchema;

// Union schema to handle both structured and simple queries
export const SectionQueryResponseSchema = z.union([
  StructuredResponseSchema,
  SimpleQuerySchema,
]);

export const queryAgent = async (
  text: string
): Promise<z.infer<typeof SectionQueryResponseSchema> | null> => {
  try {
    const run = await openai.beta.threads.createAndRun({
      assistant_id: queryAssistantId as string,
      thread: { messages: [{ role: "user", content: text }] },
    });

    let currentRun = run;
    let attempts = 0;
    const maxAttempts = 20;

    while (attempts < maxAttempts) {
      if (environment === "dev") {
        console.log("Current run status:", currentRun.status);
      }
      if (currentRun.status === "requires_action") {
        const toolOutputs = await handleRequiredActions(currentRun);
        currentRun = await openai.beta.threads.runs.submitToolOutputs(
          run.thread_id,
          currentRun.id,
          { tool_outputs: toolOutputs }
        );
        attempts++;
        continue;
      }

      if (["completed", "failed", "cancelled"].includes(currentRun.status)) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));
      currentRun = await openai.beta.threads.runs.retrieve(
        run.thread_id,
        currentRun.id
      );
      attempts++;
    }

    if (currentRun.status !== "completed") {
      console.error(
        `Run failed after ${attempts} attempts: ${currentRun.status}`
      );
      return null;
    }

    const messages = await openai.beta.threads.messages.list(run.thread_id);
    // Delete thread to clean up:
    await openai.beta.threads.del(run.thread_id);

    for (const message of messages.data.reverse()) {
      if (message.role === "assistant" && message.content[0].type === "text") {
        const content = message.content[0].text.value;
        const cleanedJson = content
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        // 1. Partial snippet from your message loop after "cleanedJson" is obtained:
        try {
          let parsed = JSON.parse(cleanedJson);

          // 2. Check if this is multiple sub-queries, i.e. no "query" at top-level:
          if (!("query" in parsed) || !("explanation" in parsed)) {
            // Attempt to transform multiple queries into a single OR
            const keys = Object.keys(parsed);
            // For safety, ensure we have at least one key and each entry has "query" + "explanation"
            const subQueries = keys
              .map((k) => {
                const entry = parsed[k];
                if (
                  entry &&
                  typeof entry === "object" &&
                  "query" in entry &&
                  "explanation" in entry
                ) {
                  return entry; // { query: {...}, explanation: "..." }
                }
                return null;
              })
              .filter(Boolean);

            // If we found valid sub-queries
            if (subQueries.length > 0) {
              // Build $or from each sub-query's 'query'
              const orArray = subQueries.map((sq) => sq.query);

              // Combine explanations
              const combinedExplanation = subQueries
                .map((sq) => sq.explanation)
                .join(" AND "); // or any delimiter you like

              // Overwrite 'parsed' with our new single structure
              parsed = {
                query: { $or: orArray },
                explanation: combinedExplanation,
              };
            }
          }
          if (environment === "dev") {
            console.log("Parsed:", JSON.stringify(parsed));
          }
          // 3. Now pass the final structure to your Zod schema:
          const validated = SectionQueryResponseSchema.safeParse(parsed);

          if (!validated.success) {
            console.error("Validation errors:", validated.error.errors);
            console.error("Received data:", parsed);
            return null;
          }

          return validated.data;
        } catch (error) {
          console.error("JSON parsing failed:", error);
          return null;
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Query agent error:", error);
    return null;
  }
};

const handleRequiredActions = async (
  run: Run
): Promise<
  {
    tool_call_id: string;
    output: string;
  }[]
> => {
  if (!run.required_action?.submit_tool_outputs?.tool_calls) return [];

  return Promise.all(
    run.required_action.submit_tool_outputs.tool_calls.map(async (toolCall) => {
      try {
        if (toolCall.function.name === "filter_sections") {
          const args = JSON.parse(toolCall.function.arguments);
          const validated = SectionQueryResponseSchema.safeParse(args);

          return {
            tool_call_id: toolCall.id,
            output: validated.success
              ? JSON.stringify({ valid: true, ...validated.data })
              : JSON.stringify({
                  valid: false,
                  errors: validated.error.errors,
                }),
          };
        }
        return {
          tool_call_id: toolCall.id,
          output: JSON.stringify({ error: "Unknown tool call" }),
        };
      } catch (error) {
        console.error("Tool call processing failed:", error);
        return {
          tool_call_id: toolCall.id,
          output: JSON.stringify({ error: "Tool execution failed" }),
        };
      }
    })
  );
};
