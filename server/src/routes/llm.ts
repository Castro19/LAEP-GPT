import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import multer from "multer";
import { openai } from "../index";
import { handleFileUpload } from "../helpers/azure/blobFunctions";
import asyncHandler from "../middlewares/asyncMiddleware";
import handleSingleAgentModel from "../helpers/assistants/singleAgent";
import handleMultiAgentModel from "../helpers/assistants/multiAgent";
import { FileObject } from "openai/resources/index.mjs";
import { llmRequestBody, RunningStreamData } from "@polylink/shared/types";

const router = express.Router();

// init storage for user documents
const upload = multer({ dest: "temp/" }); // 'temp/' is where Multer stores uploaded files

// Rate limiter for GPT messages
const messageRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 25,
  message:
    "You have exceeded the message limit of 25 messages per hour. Please try again later.",
  headers: true,
  keyGenerator: (req) => req.body.userId || "unknown-user",
});

const MAX_FILE_SIZE_MB = 1;
// Store running streams: Useful for cancelling a running stream
const runningStreams: RunningStreamData = {};
router.post(
  "/respond",
  messageRateLimiter,
  upload.single("file"),
  asyncHandler(async (req: Request, res: Response) => {
    if (!res.headersSent) {
      res.setHeader("Content-Type", "text/plain");
      res.setHeader("Transfer-Encoding", "chunked");
    }

    const { message, chatId, userId, userMessageId, currentModel } =
      req.body as llmRequestBody;

    if (!userId) {
      res.status(401).end("Unauthorized");
      return;
    }
    const model: { id: string; title: string } = JSON.parse(currentModel);

    const file = req.file;

    let userFile: FileObject | null = null;
    runningStreams[userMessageId] = {
      canceled: false,
      runId: null,
      threadId: null,
    };

    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024);

      if (!file.mimetype || !file.mimetype.includes("pdf")) {
        res.status(400).send("Only PDF files are allowed");
        return; // Just return here to stop the execution (no returning of Response object)
      }

      if (fileSizeInMB > MAX_FILE_SIZE_MB) {
        res
          .status(413)
          .send(`File size must be less than ${MAX_FILE_SIZE_MB}MB`);
        return;
      }

      if (model.title === "Will NOT Allow File Uploads for right now") {
        try {
          userFile = await handleFileUpload(file);
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      } else {
        res.status(400).send("File uploads are not allowed for this model");
        return;
      }
    }

    if (model.title === "Professor & Course Advisor") {
      try {
        await handleMultiAgentModel({
          model,
          message,
          res,
          userMessageId,
          runningStreams,
          chatId,
        });
      } catch (error) {
        console.error("Error in multi-agent model:", error);
        if (!res.headersSent) {
          res.status(500).send("Failed to process request.");
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
          runningStreams,
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
  })
);

router.post(
  "/cancel",
  asyncHandler(async (req: Request, res: Response) => {
    const { userMessageId } = req.body;

    const runData = runningStreams[userMessageId];
    if (runData) {
      runData.canceled = true;
      if (runData.runId && runData.threadId) {
        try {
          await openai.beta.threads.runs.cancel(
            runData.threadId,
            runData.runId
          );
          delete runningStreams[userMessageId];
          res.status(200).send("Run(s) cancelled");
        } catch (error: unknown) {
          const message = (error as { error: Error | null })?.error?.message;
          if (message?.includes("Cannot cancel run with status")) {
            console.log("Run canceled");
          } else if (message?.includes("already has an active run")) {
            console.log("Run already canceled: ", message);
            // TO-DO: Edge case where the run is in the pending state of being created while the user cancels the run which makes it so that the run is not canceled
          } else {
            console.error("Error cancelling run(s):", error);
            res.status(500).send("Error cancelling run(s)");
          }
        }
      } else {
        // `runId` not yet available; cancellation flag is set
        res.status(200).send("Run cancellation requested");
      }
    } else {
      res.status(404).send("Run not found");
    }
  })
);

router.post(
  "/title",
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const { message } = req.body;
      const contentStr =
        "Based on the user's message and the model description, please return a 10-30 character title response that best suits the user's message. Important The response should not be larger than 30 chars and should be a title!";

      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: contentStr,
          },
          { role: "user", content: message },
        ],
      });

      const title = chatCompletion.choices[0].message.content;
      res.json({ title: title });
    } catch (error) {
      console.error("Error calling OpenAI:", error);
      res
        .status(500)
        .json({ error: "Failed to generate response from OpenAI" });
    }
  })
);

export default router;
