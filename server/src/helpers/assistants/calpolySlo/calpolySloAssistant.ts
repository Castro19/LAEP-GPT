import { Stream } from "openai/streaming";
import { openai } from "../../..";
import calpolySloTemplate from "../calpolySlo/calpolySloTemplate";
import { OpenAI } from "openai";

type StreamReturnType = Stream<OpenAI.Responses.ResponseStreamEvent> & {
  _request_id?: string | null;
};

async function calPolySloAssistant(
  message: string,
  previousLogId?: string | null
): Promise<StreamReturnType> {
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
  return stream;
}

export default calPolySloAssistant;
