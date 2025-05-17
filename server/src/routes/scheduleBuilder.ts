import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import asyncHandler from "../middlewares/asyncMiddleware";
import { RunningStreamData } from "@polylink/shared/types";
import { isUnauthorized } from "../helpers/auth/verifyAuth";
import { v4 as uuidv4 } from "uuid";
import { run_chatbot } from "../helpers/assistants/scheduleBuilder/scheduleBuilderAgent";
import { createOrUpdateSchedule } from "../db/models/schedule/scheduleServices";
const router = express.Router();

// Rate limiter for GPT messages
const messageRateLimiter = rateLimit({
  windowMs: 3 * 60 * 60 * 1000, // 3 hours in milliseconds
  max: 10000, // FIxing Rate limit later
  message:
    "You have exceeded the message limit of 25 messages per 3 hours. Please try again later.",
  headers: true,
  keyGenerator: (req) => req.body.userId || "unknown-user",
});

// Store running streams: Useful for cancelling a running stream
const runningStreams: RunningStreamData = {};

router.post(
  "/respond",
  messageRateLimiter,
  asyncHandler(async (req: Request, res: Response) => {
    // if (!res.headersSent) {
    //   res.setHeader("Content-Type", "text/plain");
    //   res.setHeader("Transfer-Encoding", "chunked");
    // }
    let isNewSchedule = false;
    let isNewThread = false;
    const userId = req.user?.uid;
    // check if user is authorized
    if (!userId || (await isUnauthorized(userId, res))) {
      return;
    }

    let { term, scheduleId, preferences, threadId, userMsg } = req.body;

    if (!scheduleId) {
      isNewSchedule = true;
      //   create new schedule
      const result = await createOrUpdateSchedule(
        userId,
        [],
        term,
        undefined,
        []
      );
      scheduleId = result.scheduleId;
    }

    if (!threadId) {
      isNewThread = true;
      //   create new thread
      threadId = uuidv4();
    }

    if (!preferences) {
      preferences = { withTimeConflicts: true };
    }
    // run chatbot
    const result = await run_chatbot({
      userId,
      term,
      scheduleId,
      preferences,
      threadId,
      userMsg,
    });

    res.status(200).json({
      assistant: result.assistant,
      conversation: result.conversation,
      isNewSchedule,
      isNewThread,
      scheduleId,
      threadId,
    });
  })
);

export default router;
