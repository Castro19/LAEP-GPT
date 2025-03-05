// queryAgent.ts

import { openai } from "../../../index"; // or wherever your OpenAI client is set up
import { zodResponseFormat } from "openai/helpers/zod";
import { ScheduleAnalysisSchema } from "./scheduleAnalysisSchema";
import { scheduleAnalysisSystemInstructions } from "./scheduleAnalysisSyststemInstructions";

export type ScheduleAnalysisHelperResponse = {
  queryType: string;
  fetchScheduleSections: unknown;
  fetchAlternativeSections: unknown;
  fetchProfessors: unknown;
} | null;

async function scheduleAnalysisHelperAssistant(
  text: string
): Promise<ScheduleAnalysisHelperResponse> {
  try {
    // Instead of .create(), use .parse():
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o",
      messages: [
        { role: "system", content: scheduleAnalysisSystemInstructions },
        { role: "user", content: text },
      ],
      temperature: 0.7,
      // This ensures the model's response must match the Zod schema
      response_format: zodResponseFormat(ScheduleAnalysisSchema, "analysis"),
    });

    // The parsed object is available in:
    const validated = completion.choices[0].message?.parsed;

    if (!validated) {
      throw new Error(
        "Invalid response from Schedule Analysis Helper Assistant"
      );
    }

    return validated as ScheduleAnalysisHelperResponse;
  } catch (err) {
    console.error("Query agent error:", err);
    return null;
  }
}

export default scheduleAnalysisHelperAssistant;
