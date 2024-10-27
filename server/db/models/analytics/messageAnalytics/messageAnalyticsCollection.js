import db from "../../../connection.js";
const messageAnalyticsCollection = db.collection("messageAnalytics");

// Create
export const addMessageAnalytics = async (
  botMessageId,
  messageAnalyticsData
) => {
  try {
    console.log("BOT Message ID: ", botMessageId);
    console.log("Message Analytics Data: ", messageAnalyticsData);

    const result = await messageAnalyticsCollection.insertOne({
      _id: botMessageId,
      ...messageAnalyticsData,
    });
    return result;
  } catch (error) {
    console.error("Full error:", error);
    throw new Error(`Error creating message analytics: ${error.message}`);
  }
};

// Read (Not Needed Yet)

// Update
export const updateMessageAnalytics = async (botMessageId, updateData) => {
  console.log("BOT Message ID: ", botMessageId);
  console.log("Message Update Analytics Data: ", updateData);
  try {
    const result = await messageAnalyticsCollection.updateMany(
      { _id: botMessageId },
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
