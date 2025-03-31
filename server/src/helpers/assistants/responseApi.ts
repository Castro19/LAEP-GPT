import { Response } from "express";
import { Stream } from "openai/streaming";
import { OpenAI } from "openai";

import { updateLogPreviousMessageId } from "../../db/models/chatlog/chatLogServices";
import { getAssistantById } from "../../db/models/assistant/assistantServices";
import { getUserByFirebaseId } from "../../db/models/user/userServices";

import {
  AssistantDocument,
  RunningStreamData,
  ScheduleBuilderSection,
} from "@polylink/shared/types";

import { calpolyClubsAssistant } from "./helpers/singleAgentHelpers";
import {
  professorRatingsHelper,
  ProfessorRatingsObject,
} from "./professorRatings/professorRatingsHelperAssistant";
import professorRatings from "./professorRatings/professorRatings";
import scheduleAnalysisHelperAssistant from "./scheduleAnalysis/scheduleAnalysisHelperAssistant";
import scheduleAnalysis from "./scheduleAnalysis/scheduleAnalysis";

import { environment, openai } from "../..";
import { Tool } from "openai/resources/responses/responses";

export type StreamReturnType = Stream<OpenAI.Responses.ResponseStreamEvent> & {
  _request_id?: string | null;
};

interface ResponseApiParams {
  message: string;
  res: Response;
  logId: string;
  runningStreams: RunningStreamData;
  userMessageId: string;
  assistant: { id: string; title: string };
  userId: string;
  previousLogId?: string | null;
  sections?: ScheduleBuilderSection[];
}

/**
 * Determines whether the given model is "specialized" and may trigger
 * either additional helper logic or multi-agent logic.
 */
function isSpecializedModel(modelTitle: string): boolean {
  return [
    "Professor Ratings",
    "Spring Planner Assistant",
    "Schedule Analysis",
  ].includes(modelTitle);
}

/**
 * A helper function to call the OpenAI responses API and return a streaming result.
 */
async function callResponseApi(
  message: string,
  instructions: string,
  assistant: AssistantDocument,
  previousLogId?: string | null
): Promise<StreamReturnType> {
  return openai.responses.create({
    model: assistant.model,
    previous_response_id: previousLogId,
    tools: assistant.tools as Tool[] | undefined,
    input: [
      { role: "developer", content: instructions },
      { role: "user", content: message },
    ],
    stream: true,
    store: true,
  });
}

/**
 * A dedicated function to handle the "Help Assistant" by reusing callResponseApi,
 * but with a hard-coded ID for the help assistant in the database.
 */
async function callHelpAssistant(params: {
  res: Response;
  userMessageId: string;
  logId: string;
  runningStreams: RunningStreamData;
  helpMessage: string;
}): Promise<void> {
  const { res, userMessageId, logId, runningStreams, helpMessage } = params;

  try {
    // Hard-code the Help Assistant ID:
    const HELP_ASSISTANT_ID = "67b42fd0c4f92c0ed9ea73ab";
    const helpAssistantDoc = await getAssistantById(HELP_ASSISTANT_ID);

    if (!helpAssistantDoc) {
      throw new Error("Help assistant not found.");
    }

    // Use the normal callResponseApi function:
    const helpStream = await callResponseApi(
      helpMessage,
      helpAssistantDoc.instructions || "",
      helpAssistantDoc
    );

    if (!helpStream) {
      res.status(500).end("Error creating help assistant stream");
      return;
    }

    let messageId: string | undefined;
    for await (const event of helpStream) {
      // If user cancels in the middle:
      if (runningStreams[userMessageId]?.canceled) {
        res.end();
        break;
      }

      switch (event.type) {
        case "response.created": {
          // You could update some log with the new ID if needed
          messageId = event.response.id;
          try {
            await updateLogPreviousMessageId(logId, messageId);
          } catch (err) {
            if (environment === "dev") {
              console.error("Error updating log previous message id:", err);
            }
          }
          break;
        }

        case "response.output_text.delta":
          res.write(event.delta);
          break;

        case "response.output_text.done":
          res.end();
          break;

        // Tools, etc.
        case "response.web_search_call.in_progress":
          res.write("[WEB_SEARCH_START]");
          break;
        case "response.web_search_call.completed":
          res.write("[WEB_SEARCH_DONE]");
          break;
        case "response.file_search_call.in_progress":
          res.write("[FILE_SEARCH_START]");
          break;
        case "response.file_search_call.completed":
          res.write("[FILE_SEARCH_DONE]");
          break;

        default:
          // Additional events can be handled here
          break;
      }
    }
  } catch (error) {
    if (environment === "dev") {
      console.error("Error in callHelpAssistant:", error);
    }
    if (!res.headersSent) {
      res.status(500).send("Failed to process Help Assistant request.");
    } else {
      res.end();
    }
  }
}

/**
 * Main function to process a user's message, handle specialized logic or help usage,
 * and then stream the response back to the client if it's a normal assistant request.
 */
async function responseApi({
  message,
  res,
  logId,
  runningStreams,
  userMessageId,
  assistant,
  userId,
  previousLogId,
  sections = [],
}: ResponseApiParams): Promise<string | undefined> {
  try {
    if (runningStreams[userMessageId]?.canceled) {
      res.end();
      return;
    }

    const assistantDoc = await getAssistantById(assistant.id);
    if (!assistantDoc) {
      throw new Error("Assistant not found");
    }

    // ------------------------------------------------------
    // If specialized model, check for help-assistant triggers
    // ------------------------------------------------------
    if (isSpecializedModel(assistantDoc.title)) {
      // Example: The user clicked a "Start" prompt that requires help instructions
      if (
        message ===
        "[CLICK ME TO START] How do I use the Schedule Analysis Assistant?"
      ) {
        await callHelpAssistant({
          res,
          userMessageId,
          logId,
          runningStreams,
          helpMessage: "Here’s how you use the Schedule Analysis Assistant...",
        });
        return;
      }

      // Another example: "Schedule Analysis" with no sections
      if (assistantDoc.title === "Schedule Analysis" && sections.length === 0) {
        await callHelpAssistant({
          res,
          userMessageId,
          logId,
          runningStreams,
          helpMessage: "No Sections Found. Please add sections first.",
        });
        return;
      }
    }

    // ------------------------------------------------------
    // Normal single-agent or specialized logic
    // ------------------------------------------------------
    let processedMessage: string = message;

    switch (assistantDoc.title) {
      case "Calpoly SLO":
        // No additional processing
        break;

      case "Calpoly Clubs": {
        const userRecord = await getUserByFirebaseId(userId);
        if (!userRecord) {
          throw new Error("User not found");
        }
        processedMessage = calpolyClubsAssistant(userRecord, message);
        break;
      }

      case "Professor Ratings": {
        res.write("[PROFESSOR_RATINGS_HELPER_START]");
        const helperResult = await professorRatingsHelper(
          message,
          assistantDoc.helperInstructions || ""
        );
        res.write("[PROFESSOR_RATINGS_HELPER_DONE]");

        if (!helperResult) {
          throw new Error("Helper response not found");
        }

        processedMessage = await professorRatings(
          message,
          helperResult.results as ProfessorRatingsObject[]
        );
        break;
      }

      case "Schedule Analysis": {
        res.write("[SCHEDULE_ANALYSIS_HELPER_START]");
        const helperResult = await scheduleAnalysisHelperAssistant(
          `${message}\nHere are my current schedule sections: ${JSON.stringify(
            sections
          )}`,
          assistantDoc.helperInstructions || ""
        );
        res.write("[SCHEDULE_ANALYSIS_HELPER_DONE]");

        if (!helperResult) {
          throw new Error("Helper response not found");
        }

        processedMessage = await scheduleAnalysis(message, helperResult);
        break;
      }

      default:
        // No special handling
        break;
    }

    // ------------------------------------------------------
    // Stream response from the assistant
    // ------------------------------------------------------
    if (
      assistantDoc.title === "Schedule Analysis" ||
      assistantDoc.title === "Professor Ratings"
    ) {
      res.write("[ANALYSIS_START]");
    }
    const stream = await callResponseApi(
      processedMessage,
      assistantDoc.instructions || "",
      assistantDoc,
      previousLogId
    );

    if (!stream) {
      res.status(500).end("Error creating stream");
      return;
    }

    let messageId: string | undefined;

    for await (const event of stream) {
      if (runningStreams[userMessageId]?.canceled) {
        res.end();
        break;
      }

      switch (event.type) {
        case "response.created": {
          messageId = event.response.id;
          try {
            await updateLogPreviousMessageId(logId, messageId);
          } catch (error) {
            if (environment === "dev") {
              console.error("Error updating log previous message id:", error);
            }
          }
          // Indicate analysis completion for certain assistants
          if (
            assistantDoc.title === "Schedule Analysis" ||
            assistantDoc.title === "Professor Ratings"
          ) {
            res.write("[ANALYSIS_DONE]");
          }
          break;
        }

        case "response.output_text.delta":
          res.write(event.delta);
          break;

        case "response.output_text.done":
          res.end();
          break;

        // Tools
        case "response.web_search_call.in_progress":
          res.write("[WEB_SEARCH_START]");
          break;
        case "response.web_search_call.completed":
          res.write("[WEB_SEARCH_DONE]");
          break;
        case "response.file_search_call.in_progress":
          res.write("[FILE_SEARCH_START]");
          break;
        case "response.file_search_call.completed":
          res.write("[FILE_SEARCH_DONE]");
          break;

        default:
          break;
      }
    }

    return messageId;
  } catch (error) {
    if (environment === "dev") {
      console.error("Error in responseApi:", error);
    }
    if (!res.headersSent) {
      res.status(500).send("Failed to process request: " + error);
    } else {
      res.end();
    }
  }
}

export default responseApi;
