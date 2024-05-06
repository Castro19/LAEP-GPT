import dotenv from "dotenv";
dotenv.config();

import express from "express";
import OpenAI from "openai";
import {
  addMessageToThread,
  createThread,
} from "../utils/openAI/threadFunctions.js";
import {
  addThread,
  fetchThreadID,
} from "../db/models/threads/threadServices.js";

import chooseModel from "../utils/chooseModel.js";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
});

router.get("/"),
  (res) => {
    res.send("LLM Backend Working");
  };

router.post("/respond", async (req, res) => {
  res.setHeader("Content-Type", "text/plain"); // Set MIME type for plain text stream
  res.setHeader("Transfer-Encoding", "chunked");
  console.log(req.body);
  const { message, modelType, chatId } = req.body;
  console.log("CHAT ID: ", chatId);
  let threadId = await fetchThreadID(chatId);
  console.log("THREAD ID: ", threadId);

  // New Chat: Create thread and insert threadID here
  if (threadId === null) {
    const threadObj = await createThread(openai);
    threadId = threadObj.id;
    const addedThreadId = await addThread(chatId, threadId);
    console.log(addedThreadId);
  }
  console.log("THREAD ID: ", threadId);

  // Add User Message to thread:
  const threadMessages = await addMessageToThread(
    openai,
    threadId,
    "user",
    message
  );
  // console.log("Thread Messages: ", threadMessages);
  // Run Thread
  // Start the stream from OpenAI's API
  const run = openai.beta.threads.runs.stream(threadId, {
    assistant_id: process.env.ASST_ID,
  });

  run.on("textCreated", (text) => {
    // console.log("\nassistant > "); // Optionally log to server console
    // res.write("\nassistant > " + text);
  });

  run.on("textDelta", (textDelta) => {
    // console.log(textDelta.value); // Optionally log to server console
    res.write(textDelta.value);
  });

  run.on("end", () => {
    console.log("Stream completed");
    res.end();
  });

  run.on("error", (error) => {
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
    console.log("Bot Instructions: ", contentStr);
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

export default router;
