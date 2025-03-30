import { openai } from "../..";
import { Response } from "express";
import calpolySloTemplate from "./calpolySlo/calpolySloTemplate";

async function responseApi(
  message: string,
  res: Response
): Promise<string | undefined> {
  let messageId: string | undefined;

  const stream = await openai.responses.create({
    model: "gpt-4o-2024-11-20",
    input: [
      {
        role: "developer",
        content: calpolySloTemplate,
      },
      {
        role: "user",
        content: message,
      },
    ],
    stream: true,
    store: true,
  });

  for await (const event of stream) {
    if (event.type === "response.created") {
      messageId = event.response.id;
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
