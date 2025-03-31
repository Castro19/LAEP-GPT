// queryAgent.ts
import { openai } from "../../../index"; // or wherever your OpenAI client is set up
import { ScheduleAnalysisSchema } from "./scheduleAnalysisSchema";
import { ScheduleBuilderObject } from "@polylink/shared/types";

async function scheduleAnalysisHelperAssistant(
  text: string,
  instructions: string
): Promise<ScheduleBuilderObject | null> {
  try {
    const response = await openai.responses.create({
      model: "gpt-4o",
      input: [
        { role: "system", content: instructions },
        { role: "user", content: text },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "schedule_analysis",
          schema: ScheduleAnalysisSchema,
        },
      },
    });

    return JSON.parse(response.output_text) as ScheduleBuilderObject;
  } catch (err) {
    console.error("Query agent error:", err);
    return null;
  }
}

export default scheduleAnalysisHelperAssistant;
