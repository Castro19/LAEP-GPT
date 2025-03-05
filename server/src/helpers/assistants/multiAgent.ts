import { environment } from "../../index";
import { Response } from "express";
import { runAssistantAndStreamResponse } from "./streamResponse";
import {
  addMessageToThread,
  initializeOrFetchIds,
} from "../openAI/threadFunctions";
import { getAssistantById } from "../../db/models/assistant/assistantServices";
import {
  RunningStreamData,
  ScheduleBuilderSection,
  ScheduleBuilderObject,
} from "@polylink/shared/types";
import scheduleBuilder from "./multiAgentHelpers/scheduleBuilder";
import professorRatings from "./multiAgentHelpers/professorRatings";
import {
  professorRatingsHelperAssistant,
  ProfessorRatingsResponse,
} from "./professorRatings/professorRatingsHelperAssistant";
import scheduleAnalysisHelperAssistant from "./scheduleAnalysis/scheduleAnalysisHelperAssistant";
import { ScheduleAnalysisHelperResponse } from "./scheduleAnalysis/scheduleAnalysisHelperAssistant";

type MultiAgentRequest = {
  model: { id: string; title: string };
  message: string;
  res: Response;
  userMessageId: string;
  runningStreams: RunningStreamData;
  chatId: string;
  sections?: ScheduleBuilderSection[];
};

export type ProfessorRatingsObject = {
  type: "courses" | "professor" | "both" | "fallback";
  courses?: string[];
  professors?: string[];
  reason?: string;
};

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
 * Processes the helper assistant's JSON response based on the model title.
 * Calls the appropriate helper function (scheduleBuilder or professorRatings) to update the message.
 */
async function processHelperResponse(
  modelTitle: string,
  currentMessage: string,
  helperResponse: string,
  sections?: ScheduleBuilderSection[]
): Promise<string> {
  let jsonObject: ScheduleBuilderObject | ProfessorRatingsObject[] | null =
    null;

  if (modelTitle === "Schedule Builder") {
    if (!helperResponse) {
      throw new Error("Helper response is empty for Schedule Builder");
    }
    jsonObject = JSON.parse(helperResponse) as ScheduleBuilderObject;
    if (!jsonObject) {
      throw new Error("JSON object not found in helper response");
    }
    if (!sections) {
      throw new Error("Sections not provided for Schedule Builder");
    }
    // Use the scheduleBuilder helper to update the message
    return await scheduleBuilder(currentMessage, jsonObject);
  } else if (modelTitle === "Professor Ratings") {
    if (!helperResponse) {
      throw new Error("Helper response is empty for Professor Ratings");
    }
    jsonObject = JSON.parse(helperResponse).results as ProfessorRatingsObject[];
    if (!jsonObject) {
      throw new Error("JSON object not found in helper response");
    }
    // Use the professorRatings helper to update the message
    return await professorRatings(currentMessage, jsonObject);
  } else {
    // For other model titles, return the original message unmodified.
    if (environment === "dev") {
      console.log("No specific helper function for model title:", modelTitle);
    }
    return currentMessage;
  }
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

/**
 * Main function to process the multi-agent model.
 *
 * Workflow:
 * 1. Prepares the message and helper assistant based on model title.
 * 2. Initializes a thread and adds the user message.
 * 3. Runs the helper assistant and collects its JSON response.
 * 4. Validates the helper run and processes the response via the appropriate helper.
 * 5. Appends the processed message to the main thread and streams the response from the main assistant.
 */
async function handleMultiAgentModel({
  model,
  message,
  res,
  userMessageId,
  runningStreams,
  chatId,
  sections,
}: MultiAgentRequest): Promise<void> {
  try {
    // Append a newline to the original message
    let messageToAdd = message + "\n";
    let helperResponse:
      | ScheduleAnalysisHelperResponse
      | ProfessorRatingsResponse
      | null = null;

    if (model.title === "Schedule Builder") {
      messageToAdd =
        messageToAdd +
        "Here are my current schedule sections: " +
        JSON.stringify(sections);
      if (environment === "dev") {
        console.log("Message to add for Schedule Builders: ", messageToAdd);
      }
      helperResponse = await scheduleAnalysisHelperAssistant(messageToAdd);
    } else {
      helperResponse = await professorRatingsHelperAssistant(messageToAdd);
    }

    if (!helperResponse) {
      throw new Error("Helper response is empty for Professor Ratings");
    }

    try {
      const helperResponseString = JSON.stringify(helperResponse);
      // Process the helper assistant's JSON response and update the message accordingly
      messageToAdd = await processHelperResponse(
        model.title,
        messageToAdd,
        helperResponseString,
        sections
      );
    } catch (error) {
      console.error("Error in processHelperResponse:", error);
    }

    if (environment === "dev") {
      console.log("Modified message to add: ", messageToAdd);
    }

    const assistantId = await fetchMainAssistant(model.id);
    const { threadId } = await initializeOrFetchIds(chatId, null, assistantId);
    // Add the modified message to the main thread
    await addMessageToThread(
      threadId,
      "assistant",
      messageToAdd,
      null,
      model.title
    );

    if (environment === "dev") {
      console.log(
        `Running main assistant (${model.title}) with message: `,
        messageToAdd
      );
    }

    // Run the main assistant and stream the response back to the client
    await runAssistantAndStreamResponse(
      threadId,
      assistantId,
      res,
      userMessageId,
      runningStreams
    );
  } catch (error) {
    if (environment === "dev") {
      console.error("Error in handleMultiAgentModel:", error);
    }
    handleErrors(error, res);
  }
}

export default handleMultiAgentModel;
