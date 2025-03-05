import { getAssistantById } from "../../../db/models/assistant/assistantServices";
import { Response } from "express";
/**
 * Fetches the main assistant's assistantId using the provided model id.
 */
async function fetchMainAssistant(modelId: string): Promise<string> {
  const assistant = await getAssistantById(modelId);
  if (!assistant) {
    throw new Error("Assistant not found");
  }
  const assistantId = assistant.assistantId;
  if (!assistantId) {
    throw new Error("Assistant ID not found");
  }
  return assistantId;
}

/**
 * Handles error responses and sends the proper HTTP response back to the client.
 */
function handleErrors(error: unknown, res: Response): void {
  if (error instanceof Error && error.message === "Response canceled") {
    if (!res.headersSent) {
      res.status(200).end("Run canceled");
    }
  } else {
    if (!res.headersSent) {
      res.status(500).end("Failed to process request.");
    }
  }
  if (!res.headersSent) {
    res.end();
  }
}

export { fetchMainAssistant, handleErrors };
