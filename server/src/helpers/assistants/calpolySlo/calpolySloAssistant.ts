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
    model: "gpt-4o-2024-11-20", // Change to gpt-4o-mini if the web search tool is added
    previous_response_id: previousLogId,
    // tools: [{ type: "web_search_preview" }], // TODO: Uncomment once we have more funding for this
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
