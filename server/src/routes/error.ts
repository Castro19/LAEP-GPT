import express from "express";
import * as errorService from "../db/models/error/errorServices";

const router = express.Router();

// Create a new error report
router.post("/", async (req, res) => {
  try {
    const result = await errorService.createErrorReport(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error creating error report",
      error: (error as Error).message,
    });
  }
});

export default router;
