import { openai } from "../../..";
import { StreamReturnType } from "../responseApi";

async function clubsAssistant(
  message: string,
  instructions: string,
  previousLogId?: string | null
): Promise<StreamReturnType> {
  const stream = await openai.responses.create({
    model: "gpt-4o-mini",
    previous_response_id: previousLogId,
    tools: [
      {
        type: "file_search",
        vector_store_ids: ["vs_tJO0HxtpTvIGeTLXFhROS2lp"],
      },
    ],
    input: [
      { role: "developer", content: instructions },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: message,
          },
        ],
      },
    ],
    stream: true,
    store: true,
  });
  return stream;
}

export default clubsAssistant;
