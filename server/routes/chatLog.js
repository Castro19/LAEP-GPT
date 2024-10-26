import express from "express";
import {
  createLog,
  getLogsByUser,
  updateLog,
  deleteLog,
} from "../db/models/chatlog/chatLogServices.js";
import { fetchIds } from "../db/models/threads/threadServices.js";
import { deleteThreadById } from "./llm.js";
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
// FIX: Add in check for authorization
router.get("/chat/:logId", async (req, res) => {
  const userId = req.user.uid;
  res.status(200).send(`Log ${req.params.logId} for user ${userId}`);
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

// Deleting a Log
router.delete("/:logId", async (req, res) => {
  const userId = req.user.uid;
  const { logId } = req.params;

  try {
    const { threadId, vectorStoreId } = await fetchIds(logId);
    const vectorStoreFiles =
      await openai.beta.vectorStores.files.list(vectorStoreId);
    for (const file of vectorStoreFiles.data) {
      await openai.files.del(file.id);
    }
    await openai.beta.vectorStores.del(String(vectorStoreId));
    const response = await deleteLog(logId, userId);
    const deleteResponse = await deleteThreadById(threadId);
    res.status(204).json({ response, deleteResponse }); // 204 No Content is typical for a delete operation.
  } catch (error) {
    console.error("Failed to Delete log: ", error);
    res.status(404).send("Failed to Delete log in database: " + error.message);
  }
});

export default router;
