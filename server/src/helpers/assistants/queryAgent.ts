import { Run } from "openai/resources/beta/threads/runs/runs";
import { openai, queryAssistantId } from "../../index";
import { z } from "zod";
// Updated Zod Schema for validation
const SectionQueryResponseSchema = z
  .object({
    query: z
      .object({
        $and: z.array(z.record(z.any())).optional(),
        $or: z.array(z.record(z.any())).optional(),
        subject: z
          .string()
          .regex(/^[A-Z]{3,4}$/)
          .optional(),
        courseId: z
          .union([
            z.string(),
            z.object({
              $regex: z.string().regex(/^[A-Z]{3,4}\d+/),
            }),
          ])
          .optional(),
        units: z
          .union([z.string(), z.object({ $in: z.array(z.string()) })])
          .optional(),
        meetings: z
          .object({
            $elemMatch: z.object({
              days: z.object({
                $in: z.array(
                  z.enum(["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"])
                ),
              }),
              start_time: z.object({
                $gte: z.string().regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
                $lte: z
                  .string()
                  .regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
                  .optional(),
              }),
            }),
          })
          .optional(),
        instructorsWithRatings: z
          .object({
            $elemMatch: z.object({
              overallRating: z.object({
                $gte: z.number().min(0).max(4.0),
              }),
            }),
          })
          .optional(),
      })
      .passthrough()
      .refine((data) => Object.keys(data).length > 0, {
        message: "Query cannot be empty",
      }),
    explanation: z.string(),
  })
  .passthrough();

// Updated queryAgent function
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
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
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

      if (["completed", "failed", "cancelled"].includes(currentRun.status))
        break;

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

    for (const message of messages.data.reverse()) {
      if (message.role === "assistant" && message.content[0].type === "text") {
        const content = message.content[0].text.value;
        console.log("Raw assistant response:", content); // Add logging

        try {
          const cleanedJson = content
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

          const parsed = JSON.parse(cleanedJson);
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

// Updated handleRequiredActions function
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
