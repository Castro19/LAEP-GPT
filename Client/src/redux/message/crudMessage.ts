import { ModelType, SendMessageReturnType } from "@/types";
import { current } from "@reduxjs/toolkit";

export default async function sendMessage(
  currentModel: ModelType,
  file: File | null, //include file as arguement
  msg: string,
  currentChatId: string | null
): Promise<SendMessageReturnType> {
  if (!msg.trim() || msg.length >= 2000) {
    throw new Error("Message is over 2000 characters, please shorten it.");
  }

  const newUserMessage = {
    id: Date.now(),
    sender: "user",
    text: msg, //form
    model: currentModel.title,
  };

  const timeoutDuration = 17000; // 17 seconds
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error("Error: Response took too long. Please try again."));
    }, timeoutDuration);
  });

  try {
    //create FormData to send data + file to backend
    const formData = new FormData();
    formData.append("message", msg);
    formData.append("currentModel", JSON.stringify(currentModel));
    if (file) {
      formData.append("file", file);
    }
    if (currentChatId) {
      formData.append("chatId", currentChatId);
    }

    const fetchPromise: Promise<Response> = fetch(
      "http://localhost:4000/llms/respond",
      {
        method: "POST",
        body: formData,
      }
    );

    const response: Response = await Promise.race([
      fetchPromise,
      timeoutPromise,
    ]);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("RESPONSE: ", response);

    const botMessageId = Date.now() + 1;
    let accumulatedText = "";
    const botMessage = {
      id: botMessageId,
      sender: "bot",
      text: "Loading...",
      urlPhoto: currentModel.urlPhoto,
    };

    let updateOccurred = false;

    // eslint-disable-next-line no-inner-declarations
    function startTimeout(
      // eslint-disable-next-line no-unused-vars
      updateCallback: (arg0: number, arg1: string) => void
    ) {
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
      updateStream: async (
        // eslint-disable-next-line no-unused-vars
        updateCallback: (arg0: number, arg1: string) => void
      ) => {
        const decoder = new TextDecoder("utf-8");
        // Check if response.body is not null
        if (!response.body) {
          throw new Error("Response body is null");
        }
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
