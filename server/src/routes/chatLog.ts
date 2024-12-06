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
import { fetchIds } from "../db/models/threads/threadServices";
import { openai } from "../index.js";
import { MongoLogData } from "types";

const router = express.Router();

// Creating a new Log: (Create)
router.post("/", (async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { id, title, content, timestamp } = req.body;

    const newLog = {
      _id: id,
      logId: id,
      userId,
      title,
      timestamp,
      content,
    };
    const result = await createLog(newLog as MongoLogData);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send("Failed to create log: " + (error as Error).message);
    console.error("Failed to create log: ", error);
  }
}) as RequestHandler);

// Get the entire LogList: (Read)
router.get("/", (async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const logs = await getLogsByUser(userId);
    res.status(200).json(logs);
  } catch (error) {
    console.error("Failed to fetch logs: ", error);
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
    console.error("Failed to fetch log: ", error);
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
    const result = await updateLog(logId, userId, content, timestamp);

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result));
  } catch (error) {
    console.error("Failed to update log: ", error);
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
    res.status(200).json({
      message: "Log title updated successfully",
      logId,
      title,
    });
  } catch (error) {
    console.error("Failed to update log title: ", error);
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

  try {
    // Get IDs first
    const ids = (await fetchIds(logId)) as {
      threadId: string;
      vectorStoreId: string;
    } | null;
    const { threadId, vectorStoreId } = ids || {};

    // Try to delete vector store and its files
    if (vectorStoreId) {
      try {
        const vectorStoreFiles =
          await openai.beta.vectorStores.files.list(vectorStoreId);
        for (const file of vectorStoreFiles.data) {
          try {
            await openai.files.del(file.id);
          } catch (error) {
            console.warn(
              `Failed to delete file ${file.id}:`,
              (error as Error).message
            );
          }
        }
        await openai.beta.vectorStores.del(String(vectorStoreId));
      } catch (error) {
        console.warn(
          "Failed to delete vector store:",
          (error as Error).message
        );
      }
    }

    // Try to delete thread
    if (threadId) {
      try {
        await openai.beta.threads.del(threadId);
      } catch (error) {
        console.warn("Failed to delete thread:", (error as Error).message);
      }
    }

    console.log("Deleting log:", logId);
    // Always try to delete the log
    const response = await deleteLog(logId, userId);
    res.status(204).json({ message: "Log deleted successfully", response });
  } catch (error) {
    console.error("Failed to Delete log: ", error);
    res
      .status(500)
      .send("Failed to Delete log in database: " + (error as Error).message);
  }
}) as RequestHandler);

// Update Chat Message Reaction
router.put("/reaction", (async (req, res) => {
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
    console.error("Failed to update chat message reaction: ", error);
    res
      .status(500)
      .json(
        "Failed to update chat message reaction: " + (error as Error).message
      );
  }
}) as RequestHandler);

export default router;
