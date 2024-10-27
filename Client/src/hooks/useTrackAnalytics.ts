const useTrackAnalytics = () => {
  const trackCreateMessage = async ({
    userMessageId,
    botMessageId,
    logId,
    assistantId,
    hadFile,
    createdAt,
  }: {
    userMessageId: string;
    botMessageId: string;
    logId: string | null;
    assistantId: string | undefined;
    hadFile: boolean;
    createdAt: Date;
  }) => {
    try {
      const response = await fetch("http://localhost:4000/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",

        body: JSON.stringify({
          userMessageId,
          botMessageId,
          logId,
          assistantId,
          hadFile,
          createdAt,
        }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to track message: ", error);
    }
  };

  const trackUpdateMessage = async ({
    botMessageId,
    createdAt,
    hadError,
    errorMessage,
  }: {
    botMessageId: string;
    createdAt: Date;
    hadError: boolean;
    errorMessage: string | null;
  }) => {
    try {
      await fetch("http://localhost:4000/analytics", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          botMessageId,
          createdAt,
          hadError,
          errorMessage,
        }),
      });
    } catch (error) {
      console.error("Failed to track message: ", error);
    }
  };

  const trackUserReaction = async ({
    botMessageId,
    userReaction,
  }: {
    botMessageId: string;
    userReaction: "like" | "dislike" | null;
  }) => {
    try {
      await fetch("http://localhost:4000/analytics", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ botMessageId, userReaction }),
      });
    } catch (error) {
      console.error("Failed to track user reaction: ", error);
    }
  };
  return { trackCreateMessage, trackUpdateMessage, trackUserReaction };
};

export default useTrackAnalytics;

// Message Analytics

/*
  id: msg.id // client
  logId: string  // client
  assistantId: string  // client
  userId: string // middleware
  createdAt: msg.createdAt // server
  userReaction: "like" | "dislike" | null  // client (put)
  responseTime: Number,  // server 
  hadFile: boolean, // client
  hadError: boolean, // client
  errorMessage: string | null, // client

  // Not implemented yet
  inputMessage: string, // server?
  outputMessage: string, // server?
  tokensUsed: number, // server
*/
