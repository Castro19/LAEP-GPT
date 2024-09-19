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
import {
  addThread,
  fetchIds,
  deleteThread,
} from "../db/models/threads/threadServices.js";
import { getGPT } from "../db/models/gpt/gptServices.js";
import fs from "fs";

const router = express.Router();

//init storage for user documents
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Rate limiter for GPT messages
const messageRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window (in milliseconds)
  max: 25, // limit each user to 25 messages per hour
  message:
    "You have exceeded the message limit of 25 messages per hour. Please try again later.",
  headers: true,
  keyGenerator: (req) => req.body.userId, // requests are tracked per firebase userId
});

router.get("/"),
  (res) => {
    res.send("LLM Backend Working");
  };

router.post(
  "/respond",
  messageRateLimiter,
  upload.single("file"),
  async (req, res) => {
    res.setHeader("Content-Type", "text/plain"); // Set MIME type for plain text stream
    res.setHeader("Transfer-Encoding", "chunked");

    const { message, chatId } = req.body;
    const model = JSON.parse(req.body.currentModel);

    const file = req.file ? await req.file : null; //retrieve file and other data from FormData

    const isMultiAgentModel = model.title === "Enhanced ESJ Assistant";

    if (isMultiAgentModel) {
      // Multi-agent logic
      try {
        // subGPTIds are the MongoDB ids of the sub-assistants
        const subGPTIds = [
          "66e7b2784a61f99d73371faf",
          "66e7b3184a61f99d73371fb0",
        ];
        // leadingGPTId is the MongoDB id of the leading assistant
        const leadingGPTId = "66ec7a68194da294fe19139e";
        // array to store the actual OpenAI assistant ids of sub-assistants
        const assistantIds = [];
        const threadIds = [];
        const vectorStoreIds = [];

        for (let i = 0; i < subGPTIds.length; i++) {
          let fetchedModel = await getGPT(subGPTIds[i]);
          let assistant_id = fetchedModel.assistantId;
          assistantIds.push(assistant_id);
        }

        for (let i = 0; i < assistantIds.length; i++) {
          let threadObj = await createThread();
          threadIds.push(threadObj.id);

          if (file) {
            let vectorStore = await openai.beta.vectorStores.create({
              name: String(threadObj.id),
            });
            vectorStoreIds.push(vectorStore.id);

            let vectorStoreFile =
              await openai.beta.vectorStores.files.createAndPoll(
                vectorStore.id,
                {
                  file_id: file.id,
                }
              );

            await openai.beta.assistants.update(assistantIds[i], {
              tool_resources: {
                file_search: { vector_store_ids: [vectorStore.id] },
              },
            });
          }

          await addMessageToThread(
            threadObj.id,
            "user",
            message,
            file ? file.id : null
          );
        }

        // get responses from both sub-assistants
        const assistantResponses = [];

        for (let i = 0; i < assistantIds.length; i++) {
          const run = openai.beta.threads.runs.stream(threadIds[i], {
            assistant_id: assistantIds[i],
          });

          let assistantResponse = "";

          run.on("textDelta", (textDelta) => {
            assistantResponse += textDelta.value;
          });

          await new Promise((resolve, reject) => {
            run.on("end", resolve);
            run.on("errors", reject);
          });

          assistantResponses.push(assistantResponse);
        }

        // combine responses from each sub-assistant
        const combinedResponse = `**Ethical Assessment:**\n\n${assistantResponses[0]}\n\n**Social Justice Evaluation:**\n\n${assistantResponses[1]}`;

        const fetchedModel = await getGPT(leadingGPTId);
        const finalAssistantId = fetchedModel.assistantId;

        // create a new thread for the final assistant
        const finalThreadObj = await createThread();
        const finalThreadId = finalThreadObj.id;

        if (file) {
          let vectorStore = await openai.beta.vectorStores.create({
            name: String(finalThreadId),
          });

          await openai.beta.vectorStores.files.createAndPoll(vectorStore.id, {
            file_id: file.id,
          });

          // update final assistant to access the vector store
          await openai.beta.assistants.update(finalAssistantId, {
            tool_resources: {
              file_search: { vector_store_ids: [vectorStore.id] },
            },
          });
        }

        // add the combined response as a user message to the final thread
        await addMessageToThread(finalThreadId, "user", combinedResponse);

        // run the final assistant
        const finalRun = openai.beta.threads.runs.stream(finalThreadId, {
          assistant_id: finalAssistantId,
        });

        // stream the final assistant's response to the user
        finalRun.on("textDelta", (textDelta) => {
          res.write(textDelta.value);
        });

        finalRun.on("end", () => {
          res.end();
        });

        finalRun.on("errors", (error) => {
          console.error("Error streaming from final assistant:", error);
          if (!res.headersSent) {
            res
              .status(500)
              .send("Failed to process final assistant's response.");
          } else {
            res.end();
          }
        });

        // cleanup: delete threads and vector stores
        if (file) {
          fs.unlink(`uploads/${file.originalname}`, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            } else {
              console.log("File deleted successfully");
            }
          });
        }
      } catch (error) {
        console.error("Error in multi-agent logic:", error);
        if (!res.headersSent) {
          res.status(500).send("Failed to process multi-agent response.");
        } else {
          res.end();
        }
      }
    } else {
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
      console.log("ASSISTANT: ", assistant_id);

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

      //update the assistant to access resources if user submits file
      if (file) {
        await openai.beta.assistants.update(assistant_id, {
          tool_resources: {
            file_search: { vector_store_ids: [vectorStoreId] },
          },
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

        openai.beta.assistants.update(assistant_id, {
          tools: [{ type: "file_search" }],
          instructions: instr,
        });
      }

      const myAssistant = await openai.beta.assistants.retrieve(assistant_id);

      //console log to check if tools and tools_resources are added to the assistant
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
    }
  }
);

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
