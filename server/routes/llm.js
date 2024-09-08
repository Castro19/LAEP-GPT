import dotenv from "dotenv";
dotenv.config();
import express from "express";
import rateLimit from "express-rate-limit";

import { openai } from "../index.js";
import {
  addMessageToThread,
  createThread,
} from "../helpers/openAI/threadFunctions.js";
import {
  addThread,
  fetchIds,
  deleteThread,
} from "../db/models/threads/threadServices.js";
import { getGPT } from "../db/models/gpt/gptServices.js";
import fs from "fs";

const router = express.Router();

// Rate limiter for GPT messages
const messageRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window (in milliseconds)
  max: 25, // limit each user to 25 messages per hour
  message:
    "You have exceeded the message limit of 25 messages per hour. Please try again later.",
  headers: true,
  keyGenerator: (req) => req.userId, // requests are tracked per firebase userId
});

router.get("/"),
  (res) => {
    res.send("LLM Backend Working");
  };

router.post("/respond", messageRateLimiter, async (req, res) => {
  console.log(`User ID validated through rate limiter: ${req.userId}`);
  res.setHeader("Content-Type", "text/plain"); // Set MIME type for plain text stream
  res.setHeader("Transfer-Encoding", "chunked");

  const { message, chatId } = req.body;
  const model = JSON.parse(req.body.currentModel);

  const file = req.file ? await req.file : null; //retrieve file and other data from FormData

  // create file stream
  const userFile = file
    ? await openai.files.create({
        file: fs.createReadStream(file.path),
        purpose: "assistants",
      })
    : null;

  const fetchedModel = await getGPT(model.id);

  // Fetch the assistant ID with the model from gpt collection
  let assistant_id = fetchedModel.assistantId;
  console.log("ASSISSTANT: ", assistant_id);

  console.log("CHAT ID: ", chatId);
  let threadId = null;
  let vectorStoreId = null;
  const Ids = await fetchIds(chatId);
  if (Ids) {
    ({ threadId, vectorStoreId } = await fetchIds(chatId));
  }
  console.log("VECTOR ID: ", vectorStoreId);
  console.log("THREAD ID: ", threadId);

  // New Chat: Create thread and insert threadID here
  if (threadId === null) {
    const threadObj = await createThread();
    threadId = threadObj.id;

    const vectorStore = await openai.beta.vectorStores.create({
      name: String(threadId),
    });

    console.log(vectorStore);

    vectorStoreId = await vectorStore.id;

    const addedThreadId = await addThread(chatId, threadId, vectorStoreId);
    console.log(addedThreadId);
  }
  console.log("THREAD ID: ", threadId);
  console.log("VECTOR STORE ID: ", vectorStoreId);

  //add file to vector store
  const vectoreStorefile = userFile
    ? await openai.beta.vectorStores.files.createAndPoll(vectorStoreId, {
        file_id: userFile.id,
      })
    : null;
  console.log("VECTOR STORE FILE");
  console.log(vectoreStorefile);

  // delete file after vectorizing it
  if (file) {
    fs.unlink(`uploads/${file.originalname}`, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("File deleted successfully");
      }
    });
  }

  //update the assisstant to access resources if user submits file
  if (file) {
    await openai.beta.assistants.update(assistant_id, {
      tool_resources: { file_search: { vector_store_ids: [vectorStoreId] } },
    });
  }
  // Add User Message to thread:
  if (userFile) {
    await addMessageToThread(threadId, "user", message, userFile.id);
  } else {
    await addMessageToThread(threadId, "user", message, null);
  }

  //console.log("Thread Messages: ", threadMessages);
  // Run Thread
  // Start the stream from OpenAI's API

  if (userFile) {
    const instr = `
    You are a helpful assistant. Also act as a helpful assistant that responds to the prompt in a structured format.
    You are also an expert at understanding documents.
    `;

    openai.beta.assistants.update((assistant_id = assistant_id), {
      tools: [{ type: "file_search" }],
      instructions: instr,
    });
  }

  const myAssistant = await openai.beta.assistants.retrieve(assistant_id);

  //console log to check if tools and tools_resources are added to the assisstant
  console.log("ASSISTANT");
  console.log(myAssistant);

  const run = openai.beta.threads.runs.stream(threadId, {
    assistant_id,
  });

  run.on("textDelta", (textDelta) => {
    //
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
    const { message } = req.body;

    const contentStr =
      "Based on the user's message and the model description, please return a 10-30 character title response that best suits the user's message. Important The response should not be larger than 30 chars and should be a title!";
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
