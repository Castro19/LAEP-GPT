import dotenv from "dotenv";
dotenv.config();
import express from "express";

import { openai } from "../index.js";
import {
  addMessageToThread,
  createThread,
} from "../utils/openAI/threadFunctions.js";
import {
  addThread,
  fetchThreadID,
  deleteThread,
} from "../db/models/threads/threadServices.js";
import { getGPT } from "../db/models/gpt/gptServices.js";
import chooseModel from "../utils/chooseModel.js";

const router = express.Router();

router.get("/"),
  (res) => {
    res.send("LLM Backend Working");
  };

router.post("/respond", async (req, res) => {
  res.setHeader("Content-Type", "text/plain"); // Set MIME type for plain text stream
  res.setHeader("Transfer-Encoding", "chunked");
  const { message, model, chatId } = req.body;
  const fetchedModel = await getGPT(model.id);
  // Fetch the assistant ID with the model from gpt collection

  const assistant_id = fetchedModel.assistantId;

  console.log("CHAT ID: ", chatId);
  let threadId = await fetchThreadID(chatId);
  console.log("THREAD ID: ", threadId);

  // New Chat: Create thread and insert threadID here
  if (threadId === null) {
    const threadObj = await createThread();
    threadId = threadObj.id;
    const addedThreadId = await addThread(chatId, threadId);
    console.log(addedThreadId);
  }
  console.log("THREAD ID: ", threadId);

  // Add User Message to thread:
  const threadMessages = await addMessageToThread(threadId, "user", message);
  // console.log("Thread Messages: ", threadMessages);
  // Run Thread
  // Start the stream from OpenAI's API
  const run = openai.beta.threads.runs.stream(threadId, {
    assistant_id,
  });

  run.on("textDelta", (textDelta) => {
    // console.log(textDelta.value); // Optionally log to server console
    res.write(textDelta.value);
  });

  run.on("end", () => {
    console.log("Stream completed");
    res.end();
  });

  run.on("errors", (error) => {
    console.error("Error streaming from OpenAI:", error);
    if (!res.headersSent) {
      res.status(500).send("Failed to process stream.");
    } else {
      res.end(); // End the response properly if headers are already sent
    }
  });
});

router.post("/title", async (req, res) => {
  try {
    const { message, modelType } = req.body;

    const modelDesc = chooseModel(modelType);
    const contentStr =
      "Based on the user's message and the model description, please return a 10-30 character title response that best suits the user's message. Important The response should not be larger than 30 chars and should be a title! Model Description:" +
      modelDesc;
    // console.log("Bot Instructions: ", contentStr);
    // model: "gpt-3.5-turbo-0125",
    // model: "gpt-4-0613",
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content: contentStr,
        },
        { role: "user", content: message },
      ],
    });

    // Send the ChatGPT response back to the client
    const title = chatCompletion.choices[0].message.content;
    console.log("TITLE: ", title);
    res.json({ title: title });
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    res.status(500).json({ error: "Failed to generate response from OpenAI" });
  }
});

export async function deleteThreadById(threadId) {
  await deleteThread(threadId);
  return await openai.beta.threads.del(threadId);
}

export default router;
