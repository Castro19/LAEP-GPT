// professorRatingsHelperAssistant.ts

import { openai } from "../../../index"; // or wherever your OpenAI client is set up
import { professorRatingsSystemInstructions } from "./professorRatingsSystemInstructions";
import { ProfessorRatingsSchema } from "./professorRatingsSchema";
export type ProfessorRatingsResponse = {
  results: {
    type: "professor" | "courses" | "both" | "fallback";
    courses: string[] | null;
    professors: string[] | null;
    reason: string | null;
  }[];
} | null;

export const professorRatingsHelperAssistant = async (
  text: string
): Promise<ProfessorRatingsResponse> => {
  try {
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        { role: "system", content: professorRatingsSystemInstructions },
        { role: "user", content: text },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "professor_ratings",
          schema: ProfessorRatingsSchema,
        },
      },
    });

    // 6. Return the query + explanation
    return JSON.parse(response.output_text);
  } catch (error) {
    console.error("Professor Ratings Helper Assistant error:", error);
    // If anything fails (invalid JSON, schema mismatch, etc.), return null or a fallback
    return {
      results: [],
    };
  }
};
