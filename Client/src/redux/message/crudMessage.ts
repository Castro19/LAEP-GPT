import { environment, serverUrl } from "@/helpers/getEnvironmentVars";
import { AssistantType, ScheduleBuilderSection } from "@polylink/shared/types";
export default async function sendMessage(
  currentModel: AssistantType,
  msg: string,
  currentChatId: string | null,
  userMessageId: string,
  botMessageId: string,
  sections: ScheduleBuilderSection[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  // if (msg.length >= 2000) {
  //   throw new Error("Message is over 2000 characters, please shorten it.");
  // }

  let timeoutDuration = 300000; // 30 seconds default timeout

  if (currentModel.title === "Enhanced ESJ Assistant") {
    timeoutDuration = 600000; // 1 minute timeout for multi-agent model
  }

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error("Error: Response took too long. Please try again."));
    }, timeoutDuration);
  });

  try {
    // Create request body object instead of FormData
    const requestBody = {
      message: msg,
      currentModel: {
        title: currentModel.title,
        id: currentModel.id,
      },
      userMessageId: userMessageId,
      logId: currentChatId,
      sections:
        currentModel.title === "Schedule Analysis" ? sections : undefined,
    };

    const fetchPromise: Promise<Response> = fetch(`${serverUrl}/llms/respond`, {
      method: "POST",
      body: JSON.stringify(requestBody),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
    });

    const response: Response = await Promise.race([
      fetchPromise,
      timeoutPromise,
    ]);

    if (!response.ok) {
      if (response.status === 429 || response.status === 413) {
        // 429 = rate limiting: too many GPT message requests
        const errorData = await response.text();
        throw new Error(errorData);
      }
      throw new Error(`An unkown error occured. Please try again.`);
    }

    let accumulatedText = "";
    const botMessage = {
      id: botMessageId,
      sender: "bot",
      text: "Loading...",
      toolUsage: null,
      urlPhoto: currentModel.urlPhoto,
      userReaction: null,
    };

    let updateOccurred = false;

    // eslint-disable-next-line no-inner-declarations
    function startTimeout(
      // eslint-disable-next-line no-unused-vars
      updateCallback: (arg0: string, arg1: string) => void
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
      botMessage,
      updateStream: async (
        // eslint-disable-next-line no-unused-vars
        updateCallback: (arg0: string, arg1: string) => void
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
            if (environment === "dev") {
              console.log("Stream complete");
            }
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
  } catch (error: unknown) {
    if (environment === "dev") {
      console.error("Failed to fetch response:", error);
    }
    if ((error as Error).message.includes("Response took too long")) {
      throw new Error("Response took too long. Please try again.");
    } else if ((error as Error).message.includes("Failed to fetch")) {
      throw new Error("Please check your internet connection and try again.");
    }
    throw error;
  }
}

export const cancelRun = async (userMessageId: string) => {
  try {
    const response = await fetch(`${serverUrl}/llms/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userMessageId }),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to cancel bot response");
    }
  } catch (error) {
    if (environment === "dev") {
      console.error("Error cancelling bot response:", error);
    }
    throw error;
  }
};

export const sendUserReaction = async (
  logId: string,
  botMessageId: string,
  userReaction: "like" | "dislike"
) => {
  try {
    const response = await fetch(`${serverUrl}/chatLogs/reaction`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      method: "PUT",
      body: JSON.stringify({ logId, botMessageId, userReaction }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to send user reaction:", error);
    }
    throw error;
  }
};
