const useTrackAnalytics = () => {
  const trackMessage = async ({
    userMessageId,
    botMessageId,
    logId,
    assistantId,
    hadFile,
  }: {
    userMessageId: string;
    botMessageId: string;
    logId: string | null;
    assistantId: string | undefined;
    hadFile: boolean;
  }) => {
    try {
      const response = await fetch("http://localhost:4000/analytics", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          userMessageId,
          botMessageId,
          logId,
          assistantId,
          hadFile,
        }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to track message: ", error);
    }
  };

  return { trackMessage };
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
  inputMessage: string, // server?
  outputMessage: string, // server
  hadFile: boolean, // server?
  tokensUsed: number, // server
*/
