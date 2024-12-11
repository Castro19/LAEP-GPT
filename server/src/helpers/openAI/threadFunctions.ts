import dotenv from "dotenv";
dotenv.config();
import { environment, openai } from "../../index";
import {
  addThreadToDB,
  fetchIds,
} from "../../db/models/threads/threadServices";
import { Message } from "openai/resources/beta/threads/messages.mjs";
import { ThreadData } from "@polylink/shared/types";

//add fileId. fileId can be null if user does not submit file
export async function addMessageToThread(
  threadId: string,
  role: string,
  message: string,
  fileId: string | null,
  modelTitle: string
): Promise<Message | null> {
  let threadMessages;
  try {
    // null check fileId
    if (fileId !== null) {
      threadMessages = await openai.beta.threads.messages.create(threadId, {
        role: role as "user",
        content: message,
        attachments: [{ file_id: fileId, tools: [{ type: "file_search" }] }],
      });
    } else if (modelTitle === "Matching Assistant") {
      threadMessages = await openai.beta.threads.messages.create(threadId, {
        role: role as "user",
        content: message,
        attachments: [
          {
            file_id: "file-V0WgxfnUxHsZpsds2KqgUfkQ",
            tools: [{ type: "file_search" }],
          },
        ],
      });
    } else {
      threadMessages = await openai.beta.threads.messages.create(threadId, {
        role: role as "user",
        content: message,
      });
    }
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

// Create thread and vector store from OpenAI API if not already created
export async function initializeOrFetchIds(
  chatId: string,
  fileId: string | null,
  assistantId: string
): Promise<ThreadData> {
  const existing = await fetchIds(chatId);
  if (existing) {
    return existing;
  }
  // Initialize new thread and vector store
  const thread = await openai.beta.threads.create();
  let vectorStoreId: string | null = null;
  if (fileId) {
    const vectorStore = await openai.beta.vectorStores.create({
      name: String(thread.id),
    });
    vectorStoreId = vectorStore.id;
  }

  await addThreadToDB(chatId, thread.id, vectorStoreId, assistantId);
  return {
    threadId: thread.id,
    vectorStoreId: vectorStoreId,
    assistantId: assistantId,
  };
}
