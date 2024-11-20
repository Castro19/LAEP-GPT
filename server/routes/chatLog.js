import express from "express";
import {
  createLog,
  getLogsByUser,
  getLogById,
  updateLog,
  deleteLog,
  updateChatMessageReaction,
  updateLogTitle,
} from "../db/models/chatlog/chatLogServices.js";
import { fetchIds } from "../db/models/threads/threadServices.js";
import { deleteThread } from "../helpers/openAI/threadFunctions.js";
import { openai } from "../index.js";

const router = express.Router();

// Creating a new Log: (Create)
router.post("/", async (req, res) => {
  try {
    const userId = req.user.uid;
    const { id, title, content, timestamp } = req.body;

    const newLog = {
      _id: id,
      userId,
      title,
      timestamp,
      content,
    };
    const result = await createLog(newLog);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send("Failed to create log: " + error.message);
    console.error("Failed to create log: ", error);
  }
});

// Get the entire LogList: (Read)
router.get("/", async (req, res) => {
  try {
    const userId = req.user.uid;
    const logs = await getLogsByUser(userId);
    res.status(200).json(logs);
  } catch (error) {
    console.error("Failed to fetch logs: ", error);
    res.status(500).send("Failed to fetch logs: " + error.message);
  }
});

// Retreive a specific Log: (Read)
router.get("/:logId", async (req, res) => {
  const userId = req.user.uid;
  const logId = req.params.logId;

  try {
    const log = await getLogById(logId, userId);
    res.status(200).json(log);
  } catch (error) {
    console.error("Failed to fetch log: ", error);
    res.status(error.status || 500).send(error || "Failed to fetch log");
  }
});

// Updating a Log: (Update)
router.put("/", async (req, res) => {
  const { logId, content, timestamp } = req.body;
  const userId = req.user.uid;
  try {
    const result = await updateLog(logId, userId, content, timestamp);

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result));
  } catch (error) {
    console.error("Failed to update log: ", error);
    res.status(500).json("Failed to update log in database: " + error.message);
  }
});

// Update a Log Title
router.put("/title", async (req, res) => {
  const { logId, title } = req.body;
  const userId = req.user.uid;
  try {
    await updateLogTitle(logId, userId, title);
    res.status(200).json({
      message: "Log title updated successfully",
      logId,
      title,
    });
  } catch (error) {
    console.error("Failed to update log title: ", error);
    res.status(500).json("Failed to update log title: " + error.message);
  }
});

// Deleting a Log
router.delete("/:logId", async (req, res) => {
  const userId = req.user.uid;
  const { logId } = req.params;

  try {
    // Get IDs first
    const ids = (await fetchIds(logId)) || {};
    const { threadId, vectorStoreId } = ids;

    // Try to delete vector store and its files
    if (vectorStoreId) {
      try {
        const vectorStoreFiles =
          await openai.beta.vectorStores.files.list(vectorStoreId);
        for (const file of vectorStoreFiles.data) {
          try {
            await openai.files.del(file.id);
          } catch (error) {
            console.warn(`Failed to delete file ${file.id}:`, error.message);
          }
        }
        await openai.beta.vectorStores.del(String(vectorStoreId));
      } catch (error) {
        console.warn("Failed to delete vector store:", error.message);
      }
    }

    // Try to delete thread
    if (threadId) {
      try {
        await deleteThread(threadId);
      } catch (error) {
        console.warn("Failed to delete thread:", error.message);
      }
    }

    console.log("Deleting log:", logId);
    // Always try to delete the log
    const response = await deleteLog(logId, userId);
    res.status(204).json({ message: "Log deleted successfully", response });
  } catch (error) {
    console.error("Failed to Delete log: ", error);
    res.status(500).send("Failed to Delete log in database: " + error.message);
  }
});

// Update Chat Message Reaction
router.put("/reaction", async (req, res) => {
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
      .json("Failed to update chat message reaction: " + error.message);
  }
});
export default router;
