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
export async function addMessageToThread(
  threadId,
  role,
  message,
  fileId,
  modelTitle
) {
  let threadMessages;
  try {
    // null check fileId
    if (fileId !== null) {
      threadMessages = await openai.beta.threads.messages.create(threadId, {
        role: role,
        content: message,
        attachments: [{ file_id: fileId, tools: [{ type: "file_search" }] }],
      });
    } else if (modelTitle === "Matching Assistant") {
      threadMessages = await openai.beta.threads.messages.create(threadId, {
        role: role,
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
        role: role,
        content: message,
      });
    }
    return threadMessages;
  } catch (error) {
    console.error(
      `Failed to send message or get response from ${threadId}\nError:`,
      error
    );
  }
}

export async function deleteThread(threadId) {
  return await openai.beta.threads.del(threadId);
}
