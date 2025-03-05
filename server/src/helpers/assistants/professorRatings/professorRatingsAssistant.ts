import { ProfessorRatingsResponse } from "./professorRatingsHelperAssistant";
import professorRatings from "./professorRatings";
import { professorRatingsHelperAssistant } from "./professorRatingsHelperAssistant";
import { environment } from "../../..";

export type ProfessorRatingsObject = {
  type: "courses" | "professor" | "both" | "fallback";
  courses?: string[];
  professors?: string[];
  reason?: string;
};

/**
 * Handles the professor ratings flow.
 * - Calls the professor ratings helper assistant.
 * - Processes its JSON response using professorRatings.
 * - Returns the updated message.
 */
async function handleProfessorRatingsFlow(message: string): Promise<string> {
  const messageToAdd = message + "\n";
  if (environment === "dev") {
    console.log("Message to add for Professor Ratings:", messageToAdd);
  }

  const helperResponse: ProfessorRatingsResponse | null =
    await professorRatingsHelperAssistant(messageToAdd);
  if (!helperResponse) {
    throw new Error("Helper response is empty for Professor Ratings");
  }

  // Convert and parse the helper response into the expected JSON object.
  const helperResponseString = JSON.stringify(helperResponse);
  const jsonObject = JSON.parse(helperResponseString)
    .results as ProfessorRatingsObject[];
  if (!jsonObject) {
    throw new Error(
      "JSON object not found in Professor Ratings helper response"
    );
  }

  // Update the message using the professorRatings helper function.
  const updatedMessage = await professorRatings(messageToAdd, jsonObject);
  return updatedMessage;
}

export default handleProfessorRatingsFlow;
