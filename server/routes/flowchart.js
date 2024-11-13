import express from "express";
import {
  createFlowchart,
  fetchFlowchart,
} from "../db/models/flowchart/flowchartServices.js";

const router = express.Router();

// Create
router.post("/", async (req, res) => {
  try {
    const userId = req.user.uid;
    const flowchartData = req.body;
    console.log("Store flowchart in DB: ", flowchartData);
    const result = await createFlowchart(flowchartData, userId);
    console.log("Flowchart created: ", result);
    res.status(201).json({ flowchartId: result.insertedId });
  } catch (error) {
    console.error("Failed to create flowchart: ", error);
    res.status(500).send("Failed to create flowchart: " + error.message);
  }
});

// Read: Get the flowchart associated with the user
router.get("/:flowchartId", async (req, res) => {
  try {
    const userId = req.user.uid;
    const flowchartId = req.params.flowchartId;
    const result = await fetchFlowchart(flowchartId, userId);
    console.log("Flowchart fetched: ", result.flowchartData);
    res.status(200).json(result.flowchartData);
  } catch (error) {
    console.error("Failed to fetch flowchart: ", error);
    if (error.message === "Flowchart not found") {
      res.status(404).send("Flowchart not found");
    } else if (error.message === "Forbidden") {
      res.status(403).send("Forbidden");
    } else {
      res.status(500).send("Failed to fetch flowchart: " + error.message);
    }
  }
});

export default router;
