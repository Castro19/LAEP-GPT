import {
  MessageAnalyticsCreate,
  MessageAnalyticsReaction,
} from "@polylink/shared/types";

const useTrackAnalytics = () => {
  const trackCreateMessage = async ({
    userMessageId,
    botMessageId,
    logId,
    assistantId,
    hadFile,
    createdAt,
  }: MessageAnalyticsCreate) => {
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
    userMessageId,
    userMessage,
    createdAt,
    hadError,
    errorMessage,
  }: {
    userMessageId: string;
    userMessage: string | null;
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
          userMessageId,
          userMessage,
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
  }: MessageAnalyticsReaction) => {
    try {
      await fetch("http://localhost:4000/analytics/reaction", {
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
