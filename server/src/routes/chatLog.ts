import express, { RequestHandler } from "express";
import {
  createLog,
  getLogsByUser,
  getLogById,
  updateLog,
  deleteLog,
  updateChatMessageReaction,
  updateLogTitle,
} from "../db/models/chatlog/chatLogServices";

import { ChatLogDocument, CreateLogTitleData } from "@polylink/shared/types";
import { environment } from "../index";

const router = express.Router();

// Creating a new Log: (Create)
router.post("/", (async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { assistantMongoId, logId, title, content, timestamp } = req.body;

    const newLog: ChatLogDocument = {
      logId,
      assistantMongoId,
      title,
      timestamp,
      content,
      userId,
    };
    await createLog(newLog);
    res.status(201).json({ message: "Log created successfully" });
  } catch (error) {
    res.status(500).send("Failed to create log: " + (error as Error).message);
    if (environment === "dev") {
      console.error("Failed to create log: ", error);
    }
  }
}) as RequestHandler);

// Get the entire LogList by userId: (Read)
router.get("/", (async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const logs = await getLogsByUser(userId);
    res.status(200).json(logs);
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to fetch logs: ", error);
    }
    res.status(500).send("Failed to fetch logs: " + (error as Error).message);
  }
}) as RequestHandler);

// Retreive a specific Log: (Read)
router.get("/:logId", (async (req, res) => {
  const userId = req.user?.uid;
  const logId = req.params.logId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!logId) {
    return res.status(400).json({ message: "Log ID is required" });
  }

  try {
    const log = await getLogById(logId, userId);
    res.status(200).json(log);
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to fetch log: ", error);
    }
    res.status(500).send((error as Error).message || "Failed to fetch log");
  }
}) as RequestHandler);

// Updating a Log: (Update)
router.put("/", (async (req, res) => {
  const { logId, content, timestamp } = req.body;
  const userId = req.user?.uid;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!logId) {
    return res.status(400).json({ message: "Log ID is required" });
  }
  try {
    await updateLog(logId, userId, content, timestamp);
    res.status(200).json({ message: "Log updated successfully" });
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to update log: ", error);
    }
    res
      .status(500)
      .json("Failed to update log in database: " + (error as Error).message);
  }
}) as RequestHandler);

// Update a Log Title
router.put("/title", (async (req, res) => {
  const { logId, title } = req.body;
  const userId = req.user?.uid;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!logId) {
    return res.status(400).json({ message: "Log ID is required" });
  }
  try {
    await updateLogTitle(logId, userId, title);
    const response: CreateLogTitleData = {
      message: "Log title updated successfully",
      logId,
      title,
    };
    res.status(200).json(response);
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to update log title: ", error);
    }
    res
      .status(500)
      .json("Failed to update log title: " + (error as Error).message);
  }
}) as RequestHandler);

// Deleting a Log
router.delete("/:logId", (async (req, res) => {
  const userId = req.user?.uid;
  const { logId } = req.params;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!logId) {
    return res.status(400).json({ message: "Log ID is required" });
  }
  // Always try to delete the log
  try {
    await deleteLog(logId, userId);
    res.status(204).json({ message: "Log deleted successfully" });
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to Delete log: ", error);
    }
    res
      .status(500)
      .send("Failed to Delete log in database: " + (error as Error).message);
  }
}) as RequestHandler);

// Update Chat Message Reaction
router.put("/reaction", (async (req, res) => {
  const userId = req.user?.uid;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { logId, botMessageId, userReaction } = req.body;
  try {
    if (userReaction && botMessageId) {
      const result = await updateChatMessageReaction(
        logId,
        botMessageId,
        userReaction
      );
      res.status(200).json(result);
    }
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to update chat message reaction: ", error);
    }
    res
      .status(500)
      .json(
        "Failed to update chat message reaction: " + (error as Error).message
      );
  }
}) as RequestHandler);

export default router;
