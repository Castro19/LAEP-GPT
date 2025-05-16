import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { environment, client } from "../index";
import asyncHandler from "../middlewares/asyncMiddleware";

import {
  RunningStreamData,
  Section,
  SectionDocument,
} from "@polylink/shared/types";
import { createBio } from "../helpers/assistants/createBio/createBio";
import { sectionQueryAssistant } from "../helpers/assistants/SectionQuery/sectionQueryAssistant";
import { findSectionsByFilter } from "../db/models/section/sectionCollection";
import * as summerCollection from "../db/models/section/summerSectionCollection";
import * as fallSectionCollection from "../db/models/section/fallSectionCollection";
import { Filter } from "mongodb";
import { createLog, getLogById } from "../db/models/chatlog/chatLogServices";
import { isUnauthorized } from "../helpers/auth/verifyAuth";

import responseApi from "../helpers/assistants/responseApi";
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
    if (!res.headersSent) {
      res.setHeader("Content-Type", "text/plain");
      res.setHeader("Transfer-Encoding", "chunked");
    }
    const userId = req.user?.uid;
    // check if user is authorized
    if (!userId || (await isUnauthorized(userId, res))) {
      return;
    }

    const { message, userMessageId, logId, currentModel, sections } = req.body;
    let previousLogId = null;

    if (!currentModel || !userMessageId || !logId) {
      res
        .status(400)
        .end("Current model, logId, and userMessageId are required");
      return;
    }

    try {
      const log = await getLogById(logId, userId);
      previousLogId = log.previousLogId;
      if (log.content.length >= 12) {
        res
          .status(429)
          .end("Chat history is too long. Please start a new chat.");
        return;
      }
    } catch {
      // New Log Request
      const log = {
        logId,
        assistantMongoId: currentModel.id,
        title: "",
        timestamp: new Date().toISOString(),
        content: [],
        previousLogId: null,
        userId,
      };
      await createLog(log);
    }

    // Store the running streams
    runningStreams[userMessageId] = {
      canceled: false,
      runId: null,
      threadId: null,
    };
    if (
      currentModel.title === "Calpoly SLO" ||
      currentModel.title === "Calpoly Clubs" ||
      currentModel.title === "Professor Ratings" ||
      currentModel.title === "Schedule Analysis"
    ) {
      await responseApi({
        message,
        res,
        logId,
        runningStreams,
        userMessageId,
        assistant: { id: currentModel.id, title: currentModel.title },
        previousLogId,
        userId,
        sections,
      });
    } else {
      throw new Error("Invalid Assistant");
    }
  })
);

router.post(
  "/cancel",
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.uid;
    // check if user is authorized
    if (!userId || (await isUnauthorized(userId, res))) {
      return;
    }

    const { userMessageId } = req.body;

    const runData = runningStreams[userMessageId];
    if (runData) {
      runData.canceled = true;
      if (runData.runId && runData.threadId) {
        try {
          await client.beta.threads.runs.cancel(
            runData.threadId,
            runData.runId
          );
          delete runningStreams[userMessageId];
          res.status(200).send("Run(s) cancelled");
        } catch (error: unknown) {
          const message = (error as { error: Error | null })?.error?.message;
          if (message?.includes("Cannot cancel run with status")) {
            if (environment === "dev") {
              console.log("RUN CANCELED");
            }
          } else if (message?.includes("already has an active run")) {
            if (environment === "dev") {
              console.log("RUN ALREADY CANCELED: ", message);
            }
          } else {
            if (environment === "dev") {
              console.error("Error cancelling run(s):", error);
            }
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
  "/generate-bio",
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.uid;
    // check if user is authorized
    if (!userId || (await isUnauthorized(userId, res))) {
      return;
    }
    try {
      const bio = await createBio(userId);
      res.json({ bio: bio });
    } catch (error) {
      if (environment === "dev") {
        console.error("Error generating bio:", error);
      }
    }
  })
);

// Example validation middleware
const validateQueryRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { message } = req.body;
  if (!message) {
    res.status(400).json({ error: "Message is required" });
  }
  next();
};
router.post(
  "/query/:term",
  validateQueryRequest,
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const { term } = req.params;
      const { message } = req.body;

      const response = await sectionQueryAssistant(message);
      if (environment === "dev") {
        console.log("QUERY RESPONSE: ", response);
      }
      if (!response?.query) {
        // Add return here to prevent further execution
        res.status(400).json({
          error: "Could not generate valid query",
          details: response?.explanation || "Invalid search criteria",
        });
        return;
      }

      let sections: Section[] = [];
      let total: number = 0;
      if (term === "spring2025") {
        const result = await findSectionsByFilter(
          response?.query as Filter<SectionDocument>,
          0,
          25
        );
        sections = result.sections;
        total = result.total;
      } else if (term === "summer2025") {
        const result = await summerCollection.findSectionsByFilter(
          response?.query as Filter<SectionDocument>,
          0,
          25
        );
        sections = result.sections;
        total = result.total;
      } else if (term === "fall2025") {
        const result = await fallSectionCollection.findSectionsByFilter(
          response?.query as Filter<SectionDocument>,
          0,
          25
        );
        sections = result.sections;
        total = result.total;
      } else {
        throw new Error("Invalid term");
      }
      // Single successful response
      res.json({
        ...response,
        results: sections,
        totalPages: Math.ceil(total / 25),
        success: true,
      });
      return;
    } catch (error) {
      console.error("Query endpoint error:", error);
      // Return here to prevent double response
      res.status(500).json({
        error: "Internal server error during query processing",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      });
      return;
    }
  })
);

export default router;
