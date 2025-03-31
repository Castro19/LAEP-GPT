import { openai } from "../../..";
import { StreamReturnType } from "../responseApi";

async function scheduleAnalysisAssistant(
  message: string,
  instructions: string,
  previousLogId?: string | null
): Promise<StreamReturnType> {
  const stream = await openai.responses.create({
    model: "gpt-4o-mini",
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

export default scheduleAnalysisAssistant;
