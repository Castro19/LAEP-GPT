import { ProfessorRatingsResponse } from "./professorRatingsHelperAssistant";

import { professorRatingsHelperAssistant } from "./professorRatingsHelperAssistant";
import { environment } from "../../..";
import { openai } from "../../..";
import { StreamReturnType } from "../responseApi";

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
  message: string
): Promise<ProfessorRatingsResponse> {
  const messageToAdd = message + "\n";
  if (environment === "dev") {
    console.log("Message to add for Professor Ratings:", messageToAdd);
  }

  const helperResponse: ProfessorRatingsResponse | null =
    await professorRatingsHelperAssistant(messageToAdd);
  if (!helperResponse || helperResponse.results.length === 0) {
    throw new Error("Helper response is empty for Professor Ratings");
  }

  return helperResponse;
}
