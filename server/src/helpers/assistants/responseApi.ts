import { Response } from "express";
import { Stream } from "openai/streaming";
import { OpenAI } from "openai";

import { updateLogPreviousMessageId } from "../../db/models/chatlog/chatLogServices";

import calpolySloAssistant from "./calpolySlo/calpolySloAssistant";
import clubsAssistant from "./clubs/clubsAssistant";

import { RunningStreamData } from "@polylink/shared/types";

export type StreamReturnType = Stream<OpenAI.Responses.ResponseStreamEvent> & {
  _request_id?: string | null;
};

async function responseApi(
  message: string,
  res: Response,
  logId: string,
  runningStreams: RunningStreamData,
  userMessageId: string,
  type: "calpolySlo" | "clubs",
  previousLogId?: string | null
): Promise<string | undefined> {
  let messageId: string | undefined;
  let stream: StreamReturnType | undefined;

  if (type === "calpolySlo") {
    stream = await calpolySloAssistant(message, previousLogId);
  } else if (type === "clubs") {
    console.log("Creating clubs stream");
    stream = await clubsAssistant(message, previousLogId);
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
