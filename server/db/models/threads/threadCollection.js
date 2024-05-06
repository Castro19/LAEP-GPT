import db from "../../connection.js";
const threadCollection = db.collection("threads");
import { ObjectId } from "mongodb";

export const createThread = async (chatId, threadId) => {
  try {
    const newThread = {
      _id: chatId, // Use Firebase ID as MongoDB document ID
      threadId,
    };

    const result = await threadCollection.insertOne(newThread);
    return result;
  } catch (error) {
    throw new Error("Error creating a new thread: " + error.message);
  }
};

export const getThreadId = async (chatId) => {
  try {
    const document = await threadCollection.findOne({ _id: chatId });

    return document ? document.threadId : null;
  } catch (error) {
    throw new Error("Error retrieving threadID: " + error.message);
  }
};
