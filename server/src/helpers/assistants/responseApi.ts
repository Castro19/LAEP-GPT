import { openai } from "../..";
import { Response } from "express";
import calpolySloTemplate from "./calpolySlo/calpolySloTemplate";
import { updateLogPreviousMessageId } from "../../db/models/chatlog/chatLogServices";

import { RunningStreamData } from "@polylink/shared/types";
async function responseApi(
  message: string,
  res: Response,
  logId: string,
  runningStreams: RunningStreamData,
  userMessageId: string,
  previousLogId?: string | null
): Promise<string | undefined> {
  let messageId: string | undefined;

  const stream = await openai.responses.create({
    model: "gpt-4o-2024-11-20",
    previous_response_id: previousLogId,
    input: [
      { role: "developer", content: calpolySloTemplate },
      {
        role: "user",
        content: message,
      },
    ],
    stream: true,
    store: true,
  });

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
