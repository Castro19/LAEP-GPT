import express from "express";
import {
  createGpt,
  fetchGPTs,
  deleteGpt,
} from "../db/models/gpt/gptServices.js";
const router = express.Router();

// Create
router.post("/", async (req, res) => {
  const gptData = req.body;
  console.log("GPT DATA: ", gptData);

  try {
    const newGpt = await createGpt(gptData);
    res.status(201).json(newGpt);
  } catch (error) {
    res.status(500).send("Failed to create gpt: " + error.message);
    console.error("Failed to create gpt: ", error);
  }
});

// Read
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await fetchGPTs(userId);
    res
      .status(200)
      .json({ message: `GPT GET userID: ${userId}`, gptList: result });
  } catch (error) {
    console.error("Failed to fetch GPTs: ", error);
  }
});

// Delete
router.delete("/", async (req, res) => {
  const gptData = req.body;
  console.log("gpt Deleting: ", gptData);
  try {
    const deletedGpt = await deleteGpt(gptData.gptId);
    res.status(204).json({ message: deletedGpt });
  } catch (error) {
    res.status(500).send("Failed to delete gpt: " + error.message);
    console.error("Failed to delete gpt: ", error);
  }
});
/*
_id,
title (50)
desc (350), 
instructions (2500)
---

Future features?
permissions = [
    {userId, role}, ...
]

role: [admin, viewer, editor]
*/

export default router;
