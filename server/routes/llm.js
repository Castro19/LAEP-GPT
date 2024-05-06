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
  try {
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
    try {
      const stream = await openai.beta.threads.runs.create(threadId, {
        assistant_id: process.env.ASST_ID,
        stream: true,
      });

      let accumulatedData = "";
      for await (const chunk of stream) {
        accumulatedData += chunk;

        // Check and process complete lines from accumulated data
        let newlineIndex = accumulatedData.indexOf("\n");
        while (newlineIndex !== -1) {
          const line = accumulatedData.substring(0, newlineIndex).trim();
          accumulatedData = accumulatedData.substring(newlineIndex + 1);
          newlineIndex = accumulatedData.indexOf("\n");

          // Check for special control signals before any JSON parsing
          if (line === "[DONE]") {
            console.log("Stream completed");
            res.end(); // End the response if the stream is marked as done
            return; // Exit the loop and function since we're done processing
          }

          // Process JSON data if the line starts with 'data: '
          if (line.startsWith("data: ")) {
            const jsonData = line.substring(6); // Remove the 'data: ' prefix to get the JSON string
            try {
              const event = JSON.parse(jsonData);
              // console.log("Processed EVENT:", event);

              if (
                event.object === "thread.run" &&
                event.status === "completed"
              ) {
                console.log("Stream completed with status 'completed'");
                res.end(); // End the response on stream completion status
                return; // Exit the loop as we are done processing
              }

              // Handle specific event types such as 'thread.message.delta'
              if (event.delta) {
                console.log("DELTA: ", event.delta.content);
                event.delta.content.forEach((delta) => {
                  if (delta.type === "text") {
                    res.write(delta.text.value);
                    console.log("Delta text:", delta.text.value);
                  }
                });
              }
            } catch (err) {
              console.error("Error parsing JSON:", err);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error streaming from OpenAI:", error);
      res.status(500).send("Failed to process stream.");
    } finally {
      if (!res.finished) {
        res.end(); // Ensure to close the response properly
      }
    }
  } catch (error) {
    console.log("Error in llm: ", error);
  }
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
