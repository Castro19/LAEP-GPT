import { environment } from "../../..";
import { client } from "../../..";
import {
  ProfessorRatingsResponse,
  ProfessorRatingsSchema,
} from "./professorRatingsSchema";

export type ProfessorRatingsObject = {
  type: "courses" | "professor" | "both" | "fallback";
  courses?: string[];
  professors?: string[];
  reason?: string;
};

export async function professorRatingsHelper(
  message: string,
  helperInstructions: string
): Promise<ProfessorRatingsResponse> {
  const messageToAdd = message + "\n";
  if (environment === "dev") {
    console.log("Message to add for Professor Ratings:", messageToAdd);
  }

  try {
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        { role: "system", content: helperInstructions },
        { role: "user", content: messageToAdd },
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
}
