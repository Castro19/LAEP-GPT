import {
  MessageAnalyticsCreate,
  MessageAnalyticsTokenAnalytics,
  MessageAnalyticsUpdate,
} from "types";
import * as messageAnalyticsModel from "./messageAnalyticsCollection";

// create
export const createMessageAnalytics = async (
  messageAnalyticsData: MessageAnalyticsCreate
) => {
  try {
    // Convert timestamps to Date objects if they aren't already
    const sanitizedData = {
      ...messageAnalyticsData,
      createdAt: new Date(messageAnalyticsData.createdAt),
    } as MessageAnalyticsCreate;

    const result =
      await messageAnalyticsModel.addMessageAnalytics(sanitizedData);

    return result;
  } catch (error) {
    throw new Error(
      "Error creating message analytics in database: " +
        (error as Error).message
    );
  }
};

export const updateMessageAnalytics = async (
  userMessageId: string,
  updateData: MessageAnalyticsUpdate | MessageAnalyticsTokenAnalytics
) => {
  try {
    const result = await messageAnalyticsModel.updateMessageAnalytics(
      userMessageId,
      updateData
    );
    return result;
  } catch (error) {
    throw new Error(
      "Error updating message analytics in database: " +
        (error as Error).message
    );
  }
};
export const updateMessageAnalyticsReaction = async (
  botMessageId: string,
  userReaction: "like" | "dislike"
) => {
  try {
    const result = await messageAnalyticsModel.updateMessageAnalyticsReaction(
      botMessageId,
      userReaction
    );
    return result;
  } catch (error) {
    throw new Error(
      "Error updating message analytics reaction in database: " +
        (error as Error).message
    );
  }
};
