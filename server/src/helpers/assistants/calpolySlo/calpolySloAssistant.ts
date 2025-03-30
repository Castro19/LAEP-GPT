import { Stream } from "openai/streaming";
import { openai } from "../../..";
import { OpenAI } from "openai";

type StreamReturnType = Stream<OpenAI.Responses.ResponseStreamEvent> & {
  _request_id?: string | null;
};

async function calPolySloAssistant(
  message: string,
  instructions: string,
  previousLogId?: string | null
): Promise<StreamReturnType> {
  const stream = await openai.responses.create({
    model: "gpt-4o-2024-11-20",
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

export default calPolySloAssistant;
