import dotenv from "dotenv";
dotenv.config();
import { environment, openai } from "../../index";
import {
  addThreadToDB,
  fetchIds,
} from "../../db/models/threads/threadServices";
import { Message } from "openai/resources/beta/threads/messages";
import { ThreadData } from "@polylink/shared/types";

export async function addMessageToThread(
  threadId: string,
  role: string,
  message: string
): Promise<Message | null> {
  let threadMessages;
  try {
    threadMessages = await openai.beta.threads.messages.create(threadId, {
      role: role as "user",
      content: message,
    });
    return threadMessages;
  } catch (error) {
    if (environment === "dev") {
      console.error(
        `Failed to send message or get response from ${threadId}\nError:`,
        error
      );
    }
    return null;
  }
}

export async function deleteThread(threadId: string): Promise<void> {
  await openai.beta.threads.del(threadId);
}

// Create thread rom OpenAI API if not already created
export async function initializeOrFetchIds(
  chatId: string,
  assistantId: string
): Promise<ThreadData> {
  const existing = await fetchIds(chatId);
  if (existing) {
    return existing;
  }
  // Initialize new threa
  const thread = await openai.beta.threads.create();

  await addThreadToDB(chatId, thread.id, assistantId);

  return {
    threadId: thread.id,
    assistantId: assistantId,
  };
}
