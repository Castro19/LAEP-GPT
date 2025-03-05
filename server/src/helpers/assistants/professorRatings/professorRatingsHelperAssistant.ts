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
    // 1. Call the Chat Completion API with system + user messages
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: professorRatingsSystemInstructions },
        { role: "user", content: text },
      ],
      temperature: 0.7, // or your desired parameter
    });

    // 2. Extract the assistant's raw text output
    const message = response.choices[0].message.content;
    if (!message) {
      // If there's no content, we can't parse anything
      return null;
    }

    // 3. Strip out ```json fences if present
    const jsonString = message
      .replace(/```json\s*/g, "")
      .replace(/```/g, "")
      .trim();

    // 4. Convert to JS object
    const parsed = JSON.parse(jsonString);

    // 5. Validate against your improved schema
    const validated = ProfessorRatingsSchema.parse(parsed);

    // 6. Return the query + explanation
    return {
      results: validated,
    };
  } catch (error) {
    console.error("Professor Ratings Helper Assistant error:", error);
    // If anything fails (invalid JSON, schema mismatch, etc.), return null or a fallback
    return {
      results: [],
    };
  }
};
