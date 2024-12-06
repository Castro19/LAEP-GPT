import db from "../../../connection.js";
const messageAnalyticsCollection = db.collection("messageAnalytics");

// Create
export const addMessageAnalytics = async (messageAnalyticsData) => {
  try {
    const result =
      await messageAnalyticsCollection.insertOne(messageAnalyticsData);
    return result;
  } catch (error) {
    console.error("Full error:", error);
    throw new Error(`Error creating message analytics: ${error.message}`);
  }
};

// Read (Not Needed Yet)

// Update
export const updateMessageAnalytics = async (userMessageId, updateData) => {
  try {
    const result = await messageAnalyticsCollection.updateMany(
      { _id: userMessageId },
      { $set: updateData }
    );
    return result;
  } catch (error) {
    console.error("Full error:", error);
    throw new Error(
      "Error updating message analytics in database: " + error.message
    );
  }
};

export const updateMessageAnalyticsReaction = async (
  botMessageId,
  userReaction
) => {
  try {
    const result = await messageAnalyticsCollection.updateOne(
      { botMessageId },
      { $set: { userReaction } }
    );
    return result;
  } catch (error) {
    console.error("Full error:", error);
    throw new Error(
      "Error updating message analytics reaction in database: " + error.message
    );
  }
};
