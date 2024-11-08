import dotenv from "dotenv";
dotenv.config();
import express from "express";
import rateLimit from "express-rate-limit";
import multer from "multer";

import { openai } from "../index.js";
import {
  addMessageToThread,
  createThread,
} from "../helpers/openAI/threadFunctions.js";
import { getUserByFirebaseId } from "../db/models/user/userServices.js";
import { addThread, fetchIds } from "../db/models/threads/threadServices.js";
import { getGPT } from "../db/models/gpt/gptServices.js";
import {
  setupVectorStoreWithFile,
  setupVectorStoreAndUpdateAssistant,
} from "../helpers/openAI/vectorStoreFunctions.js";
import { formatAvailability } from "../helpers/formatters/availabilityFormatter.js";
import { handleFileUpload } from "../helpers/azure/blobFunctions.js";
import { updateMessageAnalytics } from "../db/models/analytics/messageAnalytics/messageAnalyticsServices.js";
import calculateCost from "../helpers/openAI/costFunction.js";

const router = express.Router();

//init storage for user documents
const upload = multer({ dest: "temp/" }); // 'temp/' is where Multer stores uploaded files

// Rate limiter for GPT messages
const messageRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window (in milliseconds)
  max: 25, // limit each user to 25 messages per hour
  message:
    "You have exceeded the message limit of 25 messages per hour. Please try again later.",
  headers: true,
  keyGenerator: (req) => req.body.userId, // requests are tracked per firebase userId
});

router.post(
  "/respond",
  messageRateLimiter,
  upload.single("file"),
  async (req, res) => {
    res.setHeader("Content-Type", "text/plain"); // Set MIME type for plain text stream
    res.setHeader("Transfer-Encoding", "chunked");

    const { message, chatId, userId, userMessageId } = req.body;
    console.log("RQB: ", req.body);
    const model = JSON.parse(req.body.currentModel);
    let userFile = null;
    const file = req.file;

    if (file && model.title !== "Matching Assistant") {
      try {
        userFile = await handleFileUpload(file);
      } catch (error) {
        console.error("Error uploading file to Azure Blob Storage:", error);
      }
    }

    const isMultiAgentModel = model.title === "Enhanced ESJ Assistant";

    if (isMultiAgentModel) {
      try {
        await handleMultiAgentModel({ userFile, message, res, file });
      } catch (error) {
        console.error("Error in multi-agent model:", error);
        if (!res.headersSent) {
          res.status(500).send("Failed to process multi-agent response.");
        } else {
          res.end();
        }
      }
    } else {
      try {
        await handleSingleAgentModel({
          model,
          chatId,
          userFile,
          message,
          res,
          userId,
          userMessageId,
        });
      } catch (error) {
        console.error("Error in single-agent model:", error);
        if (!res.headersSent) {
          res.status(500).send("Failed to process request.");
        } else {
          res.end();
        }
      }
    }
  }
);

router.post("/title", async (req, res) => {
  try {
    const { message } = req.body;

    const contentStr =
      "Based on the user's message and the model description, please return a 10-30 character title response that best suits the user's message. Important The response should not be larger than 30 chars and should be a title!";
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
    res.json({ title: title });
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    res.status(500).json({ error: "Failed to generate response from OpenAI" });
  }
});

async function handleMultiAgentModel({ userFile, message, res, file }) {
  // Sub-assistants and leading assistant IDs
  const subGPTIds = ["66e7b2784a61f99d73371faf", "66e7b3184a61f99d73371fb0"];
  const leadingGPTId = "66ec7a68194da294fe19139e";
  const assistantIds = [];
  const threadIds = [];

  // Fetch assistant IDs
  for (const subGPTId of subGPTIds) {
    const assistantId = (await getGPT(subGPTId)).assistantId;
    assistantIds.push(assistantId);
  }

  // Create threads and add messages
  for (const assistantId of assistantIds) {
    const threadObj = await createThread();
    const threadId = threadObj.id;
    threadIds.push(threadId);

    if (file) {
      await setupVectorStoreWithFile(threadId, assistantId, userFile.id);
    }

    await addMessageToThread(
      threadId,
      "user",
      message,
      file ? userFile.id : null
    );
  }

  // Collect responses from sub-assistants
  const assistantResponses = [];

  for (const [index, assistantId] of assistantIds.entries()) {
    const assistantResponse = await runAssistantAndCollectResponse(
      threadIds[index],
      assistantId
    );
    assistantResponses.push(assistantResponse);
  }

  // Combine responses
  const combinedResponse = `**Ethical Assessment:**\n\n${assistantResponses[0]}\n\n**Social Justice Evaluation:**\n\n${assistantResponses[1]}`;

  const finalAssistantId = (await getGPT(leadingGPTId)).assistantId;
  const finalThreadObj = await createThread();
  const finalThreadId = finalThreadObj.id;

  if (file) {
    await setupVectorStoreWithFile(
      finalThreadId,
      finalAssistantId,
      userFile.id
    );
  }

  // Add combined response as user message
  await addMessageToThread(finalThreadId, "user", combinedResponse, null);

  // Stream final assistant's response
  await runAssistantAndStreamResponse(finalThreadId, finalAssistantId, res);
}

async function handleSingleAgentModel({
  model,
  chatId,
  userFile,
  message,
  res,
  userId,
  userMessageId,
}) {
  let messageToAdd = message;
  const assistantId = (await getGPT(model.id)).assistantId;
  let { threadId, vectorStoreId } = (await fetchIds(chatId)) || {};
  if (!threadId) {
    const threadObj = await createThread();
    threadId = threadObj.id;

    const vectorStore = await openai.beta.vectorStores.create({
      name: String(threadId),
    });
    vectorStoreId = vectorStore.id;

    await addThread(chatId, threadId, vectorStoreId);
  }

  // Setup vector store and update assistant
  await setupVectorStoreAndUpdateAssistant(
    vectorStoreId,
    assistantId,
    userFile ? userFile.id : null
  );

  if (model.title === "Matching Assistant") {
    const user = await getUserByFirebaseId(userId);
    const availability = formatAvailability(user.availability);
    const interests = user.interests.join(", ");
    messageToAdd = `My availability: ${availability}\nMy interests: ${interests}\n${message}`;
  } else if (model.title === "CSCI Classes Assistant") {
    const user = await getUserByFirebaseId(userId);
    const year = user.year;
    messageToAdd = `Give me classes for a ${year} student\n${message}`;
  }
  // Add user message to thread
  await addMessageToThread(
    threadId,
    "user",
    messageToAdd,
    userFile ? userFile.id : null,
    model.title
  );

  // Stream assistant's response
  await runAssistantAndStreamResponse(
    threadId,
    assistantId,
    res,
    userMessageId
  );
}

async function runAssistantAndStreamResponse(
  threadId,
  assistantId,
  res,
  userMessageId
) {
  const run = openai.beta.threads.runs.stream(threadId, {
    assistant_id: assistantId,
  });

  let headersSent = false;

  // Generic event handler to catch all events and their types
  run.on("event", async (event) => {
    // Check if this is the completion event
    if (event.event === "thread.run.completed") {
      const runData = event.data;
      if (runData.usage) {
        // Fire and forget - don't await the analytics update
        const cost = calculateCost(runData.usage, runData.model);
        const tokenAnalytics = {
          modelType: runData.model,
          promptTokens: runData.usage.prompt_tokens,
          completionTokens: runData.usage.completion_tokens,
          totalTokens: runData.usage.total_tokens,
          promptCost: cost.promptCost,
          completionCost: cost.completionCost,
          totalCost: cost.totalCost,
        };

        // Run analytics update in background
        updateMessageAnalytics(userMessageId, tokenAnalytics).catch((error) =>
          console.error("Failed to update message analytics:", error)
        );
      }
    }
  });

  run.on("start", () => {
    console.log("Stream started");
    if (!headersSent) {
      res.setHeader("Content-Type", "text/plain");
      res.setHeader("Transfer-Encoding", "chunked");
      headersSent = true;
    }
  });

  run.on("textDelta", (textDelta) => {
    try {
      res.write(textDelta.value);
    } catch (error) {
      console.error("Error writing text delta:", error);
    }
  });

  run.on("end", () => {
    console.log("Stream completed");
    try {
      res.end();
    } catch (error) {
      console.error("Error ending response:", error);
    }
  });

  run.on("error", (error) => {
    console.error("Stream error:", error);
    try {
      if (!headersSent) {
        res.status(500).send("Failed to process stream.");
      } else {
        res.end();
      }
    } catch (error) {
      console.error("Error handling stream error:", error);
    }
  });
}

async function runAssistantAndCollectResponse(threadId, assistantId) {
  const run = openai.beta.threads.runs.stream(threadId, {
    assistant_id: assistantId,
  });

  let assistantResponse = "";

  run.on("textDelta", (textDelta) => {
    assistantResponse += textDelta.value;
  });

  await new Promise((resolve, reject) => {
    run.on("end", resolve);
    run.on("errors", reject);
  });

  return assistantResponse;
}

export default router;
