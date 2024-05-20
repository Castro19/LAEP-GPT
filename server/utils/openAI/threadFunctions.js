import dotenv from "dotenv";
dotenv.config();
import { openai } from "../../index.js";
export async function createThread() {
  try {
    const messageThread = await openai.beta.threads.create();
    return messageThread;
  } catch (error) {
    console.log("Error creating messageThread: ", error);
  }
}

export async function addMessageToThread(threadId, role, message) {
  try {
    const threadMessages = await openai.beta.threads.messages.create(threadId, {
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
    console.log("Streaming output RUN Failed: ", error);
  }
}
