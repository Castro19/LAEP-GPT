import { Run } from "openai/resources/beta/threads/runs/runs";
import { SectionsFilterParams } from "@polylink/shared/types";
import { openai, queryAssistantId } from "../../index";
import { z } from "zod";

// Zod schema for validation
const SectionsFilterSchema = z
  .object({
    $and: z.array(z.record(z.any())).optional(),
    $or: z.array(z.record(z.any())).optional(),
    units: z.string().optional(),
    courseAttributes: z.array(z.string()).optional(),
    "enrollment.enrollmentTotal": z
      .object({
        $gte: z.number().optional(),
        $lte: z.number().optional(),
      })
      .optional(),
    "meetings.start_time": z.string().optional(),
    "meetings.end_time": z.string().optional(),
    "instructorsWithRatings.overallRating": z
      .object({
        $gte: z.number().optional(),
      })
      .optional(),
  })
  .passthrough();

export const queryAgent = async (
  text: string
): Promise<SectionsFilterParams | null> => {
  try {
    const run = await openai.beta.threads.createAndRun({
      assistant_id: queryAssistantId as string,
      thread: { messages: [{ role: "user", content: text }] },
    });

    let currentRun = run;
    let attempts = 0;
    const maxAttempts = 10; // Increased attempts for complex workflows

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

      await new Promise((resolve) => setTimeout(resolve, 1500)); // Longer delay
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
      // Check most recent first
      if (message.role === "assistant" && message.content[0].type === "text") {
        const content = message.content[0].text.value;
        const cleanedJson = content
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        try {
          const parsed = JSON.parse(cleanedJson);
          const validated = SectionsFilterSchema.parse(parsed);
          return validated as SectionsFilterParams;
        } catch (error) {
          console.error("Validation failed:", error);
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
          const validated = SectionsFilterSchema.safeParse(args);

          return {
            tool_call_id: toolCall.id,
            output: validated.success
              ? JSON.stringify({ valid: true, filter: validated.data })
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
