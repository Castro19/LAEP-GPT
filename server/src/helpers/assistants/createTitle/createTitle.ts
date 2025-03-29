import { openai } from "../../../index";
export const createTitle = async (msg: string): Promise<string> => {
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Based on the user's message and the model description, please return a 10-30 character title response that best suits the user's message. Important The response should not be larger than 30 chars and should be a title!",
      },
      { role: "user", content: msg },
    ],
  });
  const title = chatCompletion.choices[0].message.content;
  if (!title) {
    throw new Error("No title found");
  }
  return title;
};
