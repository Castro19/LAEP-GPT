import { Response } from "express";
import { Stream } from "openai/streaming";
import { OpenAI } from "openai";

import { updateLogPreviousMessageId } from "../../db/models/chatlog/chatLogServices";

import calpolySloAssistant from "./calpolySlo/calpolySloAssistant";
import clubsAssistant from "./clubs/clubsAssistant";

import { RunningStreamData } from "@polylink/shared/types";
import { getAssistantById } from "../../db/models/assistant/assistantServices";
import { getUserByFirebaseId } from "../../db/models/user/userServices";
import { calpolyClubsAssistant } from "./singleAgent";
import {
  professorRatingsHelper,
  professorRatingsAssistant,
  ProfessorRatingsObject,
} from "./professorRatings/professorRatingsAssistant";
import professorRatings from "./professorRatings/professorRatings";

export type StreamReturnType = Stream<OpenAI.Responses.ResponseStreamEvent> & {
  _request_id?: string | null;
};

type ResponseApiParams = {
  message: string;
  res: Response;
  logId: string;
  runningStreams: RunningStreamData;
  userMessageId: string;
  assistant: { id: string; title: string };
  userId: string;
  previousLogId?: string | null;
};
async function responseApi({
  message,
  res,
  logId,
  runningStreams,
  userMessageId,
  assistant,
  previousLogId,
  userId,
}: ResponseApiParams): Promise<string | undefined> {
  let messageId: string | undefined;
  let stream: StreamReturnType | undefined;

  // Fetch assistant from db
  const fetchAssistant = await getAssistantById(assistant.id);
  if (!fetchAssistant) {
    throw new Error("Assistant not found");
  }

  if (fetchAssistant.title === "Calpoly SLO") {
    stream = await calpolySloAssistant(
      message,
      fetchAssistant.instructions || "",
      previousLogId
    );
  } else if (fetchAssistant.title === "Calpoly Clubs") {
    const user = await getUserByFirebaseId(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const messageToAdd = calpolyClubsAssistant(user, message);

    stream = await clubsAssistant(
      messageToAdd,
      fetchAssistant.instructions || "",
      previousLogId
    );
  } else if (fetchAssistant.title === "Professor Ratings") {
    res.write("[PROFESSOR_RATINGS_HELPER_START]");
    const helperResponse = await professorRatingsHelper(
      message,
      fetchAssistant.helperInstructions || ""
    );
    res.write("[PROFESSOR_RATINGS_HELPER_DONE]");

    if (!helperResponse) {
      throw new Error("Helper response not found");
    }
    // Update the message using the professorRatings helper function.
    const updatedMessage = await professorRatings(
      message,
      helperResponse.results as ProfessorRatingsObject[]
    );
    res.write("[ANALYSIS_START]");

    stream = await professorRatingsAssistant(
      updatedMessage,
      fetchAssistant.instructions || "",
      previousLogId
    );
  }

  if (!stream) {
    res.status(500).end("Error creating stream");
    return;
  }

  for await (const event of stream) {
    // If the user has canceled, break out right away
    if (runningStreams[userMessageId]?.canceled) {
      // End the HTTP response so no more data is sent to the user
      res.end();
      // Stop reading from the stream
      break;
    }

    if (event.type === "response.created") {
      messageId = event.response.id;
      try {
        await updateLogPreviousMessageId(logId, messageId);
      } catch (error) {
        console.error("Error updating log previous message id: ", error);
      }
    }
    if (event.type === "response.output_text.delta") {
      res.write(event.delta);
    } else if (event.type === "response.output_text.done") {
      res.end();
    }

    // Tools:
    // Web search
    if (event.type === "response.web_search_call.in_progress") {
      res.write("[WEB_SEARCH_START]");
    } else if (event.type === "response.web_search_call.completed") {
      res.write("[WEB_SEARCH_DONE]");
      // File search
    } else if (event.type === "response.file_search_call.in_progress") {
      res.write("[FILE_SEARCH_START]");
    } else if (event.type === "response.file_search_call.completed") {
      res.write("[FILE_SEARCH_DONE]");
    } else if (event.type === "response.created") {
      res.write("[ANALYSIS_DONE]");
    }
  }
  return messageId;
}

export default responseApi;
