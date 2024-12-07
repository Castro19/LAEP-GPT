import {
  MessageAnalyticsDocument,
  MessageAnalyticsCreate,
  MessageAnalyticsTokenAnalytics,
  MessageAnalyticsUpdate,
} from "@polylink/shared/types";
import { getDb } from "../../../connection";
import { Collection, InsertOneResult, UpdateResult } from "mongodb";

let messageAnalyticsCollection: Collection<
  MessageAnalyticsDocument | MessageAnalyticsCreate
>;

const initializeCollection: () => void = () => {
  messageAnalyticsCollection = getDb().collection("messageAnalytics");
};

// Create
export const addMessageAnalytics: (
  messageAnalyticsData: MessageAnalyticsCreate
) => Promise<InsertOneResult<MessageAnalyticsDocument>> = async (
  messageAnalyticsData: MessageAnalyticsCreate
) => {
  if (!messageAnalyticsCollection) initializeCollection();
  try {
    const result =
      await messageAnalyticsCollection.insertOne(messageAnalyticsData);
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
export const updateMessageAnalytics: (
  userMessageId: string,
  updateData: MessageAnalyticsUpdate | MessageAnalyticsTokenAnalytics
) => Promise<UpdateResult> = async (
  userMessageId: string,
  updateData: MessageAnalyticsUpdate | MessageAnalyticsTokenAnalytics
) => {
  try {
    const result = await messageAnalyticsCollection.updateMany(
      { _id: userMessageId },
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

export const updateMessageAnalyticsReaction: (
  botMessageId: string,
  userReaction: "like" | "dislike"
) => Promise<UpdateResult> = async (botMessageId, userReaction) => {
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
