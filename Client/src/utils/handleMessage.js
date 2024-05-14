export default async function sendMessage(modelType, msg, currentChatId) {
  if (!msg.trim() || msg.length >= 2000) {
    throw new Error("Message is over 2000 characters, please shorten it.");
  }

  const newUserMessage = {
    id: Date.now(),
    sender: "user",
    text: msg,
    mode: modelType,
  };

  try {
    const response = await fetch("http://localhost:4000/llms/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: msg,
        modelType: modelType,
        chatId: currentChatId,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // const render = response.body.getReader();
    let botMessageId = Date.now() + 1;
    let accumulatedText = "";
    const botMessage = { id: botMessageId, sender: "bot", text: "Loading..." };

    return {
      newUserMessage,
      botMessage,
      updateStream: async (updateCallback) => {
        const decoder = new TextDecoder("utf-8");
        const reader = response.body.getReader();

        async function processText() {
          const { done, value } = await reader.read();
          if (done) {
            console.log("Stream complete");
            return;
          }
          const chunk = decoder.decode(value, { stream: true });
          accumulatedText += chunk;
          updateCallback(botMessageId, accumulatedText); // Update the UI for each chunk

          return processText(); // Continue processing next chunk
        }

        await processText(); // Start processing
        return accumulatedText.trim(); // Final accumulated text might not be necessary to return
      },
    };
  } catch (error) {
    console.error("Failed to fetch response:", error);
    throw error;
  }
}
