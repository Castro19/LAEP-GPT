import express, { RequestHandler } from "express";
import {
  createFlowchart,
  fetchFlowchart,
  fetchAllFlowcharts,
  updateFlowchart,
  deleteFlowchart,
  updateAllOtherFlowcharts,
} from "../db/models/flowchart/flowchartServices";
import { FlowchartData } from "@polylink/shared/types";

const router = express.Router();

// Create
router.post("/", (async (req, res) => {
  const userId = req.user?.uid;
  if (!userId) {
    res.status(401).send("Unauthorized");
    return;
  }
  const { flowchartData, name } = req.body as {
    flowchartData: FlowchartData;
    name: string;
  };
  try {
    const result = await createFlowchart(flowchartData, name, userId);
    res.status(201).json(result);
  } catch (error) {
    console.error("Failed to create flowchart: ", error);
    res
      .status(500)
      .send("Failed to create flowchart: " + (error as Error).message);
  }
}) as RequestHandler);

// Read All: Get all flowcharts associated with the user
router.get("/", (async (req, res) => {
  const userId = req.user?.uid;
  if (!userId) {
    res.status(401).send("Unauthorized");
    return;
  }
  try {
    const result = await fetchAllFlowcharts(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to fetch all flowcharts: ", error);
    res
      .status(500)
      .send("Failed to fetch all flowcharts: " + (error as Error).message);
  }
}) as RequestHandler);

// Read: Get the flowchart associated with the user
router.get("/:flowchartId", (async (req, res) => {
  const userId = req.user?.uid;
  if (!userId) {
    res.status(401).send("Unauthorized");
    return;
  }
  try {
    const flowchartId = req.params.flowchartId;
    const result = await fetchFlowchart(flowchartId, userId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to fetch flowchart: ", error);
    if ((error as Error).message === "Flowchart not found") {
      res.status(404).send("Flowchart not found");
    } else if ((error as Error).message === "Forbidden") {
      res.status(403).send("Forbidden");
    } else {
      res
        .status(500)
        .send("Failed to fetch flowchart: " + (error as Error).message);
    }
  }
}) as RequestHandler);

router.put("/:flowchartId", (async (req, res) => {
  const userId = req.user?.uid;
  if (!userId) {
    res.status(401).send("Unauthorized");
    return;
  }
  try {
    const flowchartId = req.params.flowchartId;
    const { flowchartData, name, primaryOption } = req.body;

    const result = await updateFlowchart(
      flowchartId,
      flowchartData,
      name,
      primaryOption,
      userId
    );
    // Handle the case where user updates the primary option. Now we have to set all the other flowcharts' primaryOption to false
    if (primaryOption) {
      await updateAllOtherFlowcharts(flowchartId, userId);
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to update flowchart: ", error);
    if ((error as Error).message === "Flowchart not found") {
      res.status(404).send("Flowchart not found");
    } else if ((error as Error).message === "Forbidden") {
      res.status(403).send("Forbidden");
    } else {
      res
        .status(500)
        .send("Failed to update flowchart: " + (error as Error).message);
    }
  }
}) as RequestHandler);

// Delete
router.delete("/:flowchartId", (async (req, res) => {
  const userId = req.user?.uid;
  if (!userId) {
    res.status(401).send("Unauthorized");
    return;
  }
  try {
    const flowchartId = req.params.flowchartId;
    const result = await deleteFlowchart(flowchartId, userId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to delete flowchart: ", error);
    if ((error as Error).message === "Flowchart not found") {
      res.status(404).send("Flowchart not found");
    } else if ((error as Error).message === "Forbidden") {
      res.status(403).send("Forbidden");
    } else {
      res
        .status(500)
        .send("Failed to delete flowchart: " + (error as Error).message);
    }
  }
}) as RequestHandler);

export default router;
