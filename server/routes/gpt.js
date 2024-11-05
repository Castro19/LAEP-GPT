import express from "express";
import {
  createGpt,
  fetchGPTs,
  deleteGpt,
} from "../db/models/gpt/gptServices.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";
const router = express.Router();

// Create
router.post("/", authorizeRoles(["admin", "teacher"]), async (req, res) => {
  try {
    const userId = req.user.uid;
    const gptData = req.body;
    const newGpt = await createGpt(gptData, userId);
    res.status(201).json(newGpt);
  } catch (error) {
    res.status(500).send("Failed to create gpt: " + error.message);
    console.error("Failed to create gpt: ", error);
  }
});

// Read: Get all GPTs
router.get("/", async (req, res) => {
  try {
    const result = await fetchGPTs();
    res.status(200).json({ gptList: result });
  } catch (error) {
    console.error("Failed to fetch GPTs: ", error);
  }
});

// Delete
router.delete("/", authorizeRoles(["admin", "teacher"]), async (req, res) => {
  const gptData = req.body;
  // FIX Later: Only allow admins and teachers who made the gpt to delete it
  try {
    const deletedGpt = await deleteGpt(gptData.gptId);
    res.status(204).json({ message: deletedGpt });
  } catch (error) {
    res.status(500).send("Failed to delete gpt: " + error.message);
    console.error("Failed to delete gpt: ", error);
  }
});

export default router;
