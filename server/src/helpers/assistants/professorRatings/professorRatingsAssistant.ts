import { environment } from "../../..";
import { openai } from "../../..";
import { StreamReturnType } from "../responseApi";
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

export async function professorRatingsAssistant(
  message: string,
  instructions: string,
  previousLogId?: string | null
): Promise<StreamReturnType> {
  const stream = await openai.responses.create({
    model: "gpt-4o-mini",
    previous_response_id: previousLogId,
    input: [
      { role: "developer", content: instructions },
      {
        role: "user",
        content: message,
      },
    ],
    stream: true,
    store: true,
  });
  return stream;
}

export async function professorRatingsHelper(
  message: string,
  helperInstructions: string
): Promise<ProfessorRatingsResponse> {
  const messageToAdd = message + "\n";
  if (environment === "dev") {
    console.log("Message to add for Professor Ratings:", messageToAdd);
  }

  try {
    const response = await openai.responses.create({
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
