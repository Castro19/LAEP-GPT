// queryAgent.ts

import { openai } from "../../index"; // or wherever your OpenAI client is set up
import { FilterSectionsSchema } from "./mongoSectionQuery/sectionQuerySchema";
import { systemInstructions } from "./mongoSectionQuery/sectionQuerySyststemInstructions"; // import system instructions

export type QueryResponse = {
  query: unknown;
  explanation?: string;
} | null;

export const queryAgent = async (text: string): Promise<QueryResponse> => {
  try {
    // 1. Call the Chat Completion API with system + user messages
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemInstructions },
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
    const validated = FilterSectionsSchema.parse(parsed);

    // 6. Return the query + explanation
    return {
      query: validated.arguments.query,
      explanation: validated.arguments.explanation,
    };
  } catch (error) {
    console.error("Query agent error:", error);
    // If anything fails (invalid JSON, schema mismatch, etc.), return null or a fallback
    return {
      query: null,
      explanation: "Failed to parse or validate AI response",
    };
  }
};
