import {
  MessageAnalytics,
  MessageAnalyticsCreate,
  MessageAnalyticsUpdate,
} from "types";
import { getDb } from "../../../connection";
import { Collection, ObjectId } from "mongodb";

let messageAnalyticsCollection: Collection;

const initializeCollection = () => {
  messageAnalyticsCollection = getDb().collection("messageAnalytics");
};

// Create
export const addMessageAnalytics = async (
  messageAnalyticsData: MessageAnalyticsCreate
) => {
  if (!messageAnalyticsCollection) initializeCollection();
  try {
    const result = await messageAnalyticsCollection.insertOne(
      messageAnalyticsData as unknown as Document
    );
    return result;
  } catch (error) {
    console.error("Full error:", error);
    throw new Error(
      `Error creating message analytics: ${(error as Error).message}`
    );
  }
};

// Read (Not Needed Yet)

// Update
export const updateMessageAnalytics = async (
  userMessageId: string,
  updateData: MessageAnalyticsUpdate
) => {
  try {
    const result = await messageAnalyticsCollection.updateMany(
      { _id: userMessageId as unknown as ObjectId },
      { $set: updateData }
    );
    return result;
  } catch (error) {
    console.error("Full error:", error);
    throw new Error(
      `Error updating message analytics in database: ${(error as Error).message}`
    );
  }
};

export const updateMessageAnalyticsReaction = async (
  botMessageId: string,
  userReaction: "like" | "dislike"
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
      `Error updating message analytics reaction in database: ${(error as Error).message}`
    );
  }
};
