import * as ThreadModel from "./threadCollection.js";

// Confirming the structure in threadServices.js after adding a thread
export const addThread = async (chatId, threadId) => {
  try {
    const result = await ThreadModel.createThread(chatId, threadId);
    return {
      message: "Thread created successfully",
      threadId: result.insertedId.toString(), // Ensuring the ID is a string if needed
    };
  } catch (error) {
    console.error("Service error: ", error.message);
    throw new Error("Service error: " + error.message);
  }
};

// Read
export const fetchThreadID = async (chatId) => {
  try {
    const threadId = await ThreadModel.getThreadId(chatId);
    return threadId ? threadId : null;
  } catch (error) {
    console.error("Error fetching thread ID: ", error.message);
    return null;
  }
};

// Delete
export const deleteThread = async (threadId) => {
  try {
    await ThreadModel.deleteThreadByID(threadId);
  } catch (error) {
    console.error("Error fetching thread ID: ", error.message);
    return null;
  }
};
