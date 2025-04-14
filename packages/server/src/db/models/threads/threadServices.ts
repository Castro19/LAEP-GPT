import { ThreadData } from "@polylink/shared/types";
import * as ThreadModel from "./threadCollection";
import { environment } from "../../../index";
// Confirming the structure in threadServices.js after adding a thread
export const addThreadToDB = async (
  chatId: string,
  threadId: string,
  assistantId: string
): Promise<{ message: string; threadId: string }> => {
  try {
    const result = await ThreadModel.createThread(
      chatId,
      threadId,
      assistantId
    );
    return {
      message: "Thread created successfully",
      threadId: result.insertedId.toString(), // Ensuring the ID is a string if needed
    };
  } catch (error) {
    if (environment === "dev") {
      console.error("Service error: ", (error as Error).message);
    }
    throw new Error("Service error: " + (error as Error).message);
  }
};

// Read
export const fetchIds = async (chatId: string): Promise<ThreadData | null> => {
  try {
    const ids = await ThreadModel.getIds(chatId);
    if (!ids) return null;
    return {
      threadId: ids.threadId,
      assistantId: ids.assistantId,
    };
  } catch (error) {
    if (environment === "dev") {
      console.error("No thread found: ", (error as Error).message);
    }
    return null;
  }
};

// Delete
export const deleteThread = async (threadId: string): Promise<void> => {
  try {
    await ThreadModel.deleteThreadByID(threadId);
  } catch (error) {
    if (environment === "dev") {
      console.error("Error fetching thread ID: ", (error as Error).message);
    }
    return;
  }
};
