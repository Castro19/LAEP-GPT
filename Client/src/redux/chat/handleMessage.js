export default async function sendMessage(currentModel, msg, currentChatId) {
  if (!msg.trim() || msg.length >= 2000) {
    throw new Error("Message is over 2000 characters, please shorten it.");
  }

  const newUserMessage = {
    id: Date.now(),
    sender: "user",
    text: msg,
    model: currentModel.title,
  };

  const timeoutDuration = 10000; // 10 seconds
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("Error: Response took too long. Please try again."));
    }, timeoutDuration);
  });

  try {
    const fetchPromise = fetch("http://localhost:4000/llms/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: msg,
        model: currentModel,
        chatId: currentChatId,
      }),
    });

    const response = await Promise.race([fetchPromise, timeoutPromise]);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("RESPONSE: ", response);

    let botMessageId = Date.now() + 1;
    let accumulatedText = "";
    const botMessage = {
      id: botMessageId,
      sender: "bot",
      text: "Loading...",
      urlPhoto: currentModel.urlPhoto,
    };

    let updateOccurred = false;

    // eslint-disable-next-line no-inner-declarations
    function startTimeout(updateCallback) {
      setTimeout(() => {
        if (!updateOccurred) {
          updateCallback(
            botMessageId,
            "Error: Response took too long. Please try again."
          );
        }
      }, timeoutDuration);
    }

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
          updateOccurred = true; // Mark that an update has occurred

          return processText(); // Continue processing next chunk
        }

        startTimeout(updateCallback); // Start the timeout mechanism

        await processText(); // Start processing
        return accumulatedText.trim(); // Final accumulated text might not be necessary to return
      },
    };
  } catch (error) {
    console.error("Failed to fetch response:", error);
    throw error;
  }
}
