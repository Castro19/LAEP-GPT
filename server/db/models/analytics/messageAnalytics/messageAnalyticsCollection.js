import db from "../../../connection.js";
const messageAnalyticsCollection = db.collection("messageAnalytics");

// Create
export const addMessageAnalytics = async (messageAnalyticsData) => {
  try {
    console.log("Message Analytics Data: ", messageAnalyticsData);

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
  console.log("User Message ID: ", userMessageId);
  console.log("Message Update Analytics Data: ", updateData);
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
