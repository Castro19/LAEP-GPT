import express from "express";
import { createAssistant } from "../helpers/openAI/assistantFunctions.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, description, prompt } = req.body;
  try {
    const assistant = await createAssistant(name, description, prompt);
    res.status(201).json(assistant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
