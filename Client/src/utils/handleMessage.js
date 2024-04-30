export default async function sendMessage(modelType, msg) {
  if (!msg.trim() || msg.length >= 2000) {
    throw new Error("Message is over 2000 characters, please shorten it.");
  }

  const newUserMessage = {
    id: Date.now(),
    sender: "user",
    text: msg,
    mode: modelType,
  };

  // eslint-disable-next-line no-useless-catch
  try {
    const response = await fetch("http://localhost:4000/llms/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, modelType: modelType }),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const render = response.body.getReader();
    let botMessageId = Date.now() + 1;
    let accumulatedText = "";
    const botMessage = { id: botMessageId, sender: "bot", text: "Loading..." };

    return {
      newUserMessage,
      botMessage,
      updateStream: async (updateCallback) => {
        while (true) {
          const { done, value } = await render.read();
          if (done) break;

          const decoder = new TextDecoder();
          const chunks = decoder.decode(value).split("\n");
          chunks.forEach((chunk) => {
            if (chunk) {
              const obj = JSON.parse(chunk);
              accumulatedText += obj.choices[0].delta.content ?? "" + " ";
              updateCallback(botMessageId, accumulatedText);
            }
          });
        }
        return accumulatedText.trim(); // Final update to the bot message
      },
    };
  } catch (error) {
    throw error;
  }
}
