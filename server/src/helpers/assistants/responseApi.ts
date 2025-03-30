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
  }
  return messageId;
}

export default responseApi;
