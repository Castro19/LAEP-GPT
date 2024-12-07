import express, { RequestHandler } from "express";
import { fetchAssistants } from "../db/models/assistant/assistantServices.js";

const router = express.Router();

// Read: Get all GPTs
router.get("/", (async (req, res) => {
  const userId = req.user?.uid;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const result = await fetchAssistants();
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to fetch GPTs: ", error);
  }
}) as RequestHandler);

export default router;
