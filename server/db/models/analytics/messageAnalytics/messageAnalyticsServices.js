import * as messageAnalyticsModel from "./messageAnalyticsCollection.js";

// create
export const createMessageAnalytics = async (
  botMessageId,
  messageAnalyticsData
) => {
  try {
    // Convert timestamps to Date objects if they aren't already
    const sanitizedData = {
      ...messageAnalyticsData,
      createdAt: new Date(messageAnalyticsData.createdAt),
    };

    const result = await messageAnalyticsModel.addMessageAnalytics(
      botMessageId,
      sanitizedData
    );

    return result;
  } catch (error) {
    throw new Error(
      "Error creating message analytics in database: " + error.message
    );
  }
};

export const updateMessageAnalytics = async (botMessageId, updateData) => {
  try {
    const result = await messageAnalyticsModel.updateMessageAnalytics(
      botMessageId,
      updateData
    );
    return result;
  } catch (error) {
    throw new Error(
      "Error updating message analytics in database: " + error.message
    );
  }
};
