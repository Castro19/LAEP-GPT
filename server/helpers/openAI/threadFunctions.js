import dotenv from "dotenv";
dotenv.config();
import { openai } from "../../index.js";
export async function createThread() {
  try {
    const messageThread = await openai.beta.threads.create();
    return messageThread;
  } catch (error) {
    console.error("Error creating messageThread: ", error);
  }
}
//add fileId. fileId can be null if user does not submit file
export async function addMessageToThread(threadId, role, message, fileId) {
  try {
    // null check fileIf
    const threadMessages = fileId
      ? await openai.beta.threads.messages.create(threadId, {
          role: role,
          content: message,
          attachments: [{ file_id: fileId, tools: [{ type: "file_search" }] }],
        })
      : await openai.beta.threads.messages.create(threadId, {
          role: role,
          content: message,
        });
    return threadMessages;
  } catch (error) {
    console.error(
      `Failed to send message or get response from ${threadId}\nError:`,
      error
    );
  }
}

export async function fetchThread(threadId) {
  return await openai.beta.threads.retrieve(threadId);
}

export async function deleteThread(threadId) {
  return await openai.beta.threads.del(threadId);
}

export async function runThread(openai, threadId) {
  try {
    const stream = await openai.beta.threads.runs.create(threadId, {
      assistant_id: process.env.ASST_ID,
      stream: true,
    });
    return stream;
  } catch (error) {
    console.error("Streaming output RUN Failed: ", error);
  }
}
