import express from "express";
import { searchFlowInfo } from "../db/models/flowInfo/flowInfoServices.js";

const router = express.Router();

// router.post("/upload", async (req, res) => {
//   try {
//     const result = await uploadFlowchart();
//     res.status(200).json(result);
//   } catch (error) {
//     console.error("Failed to upload flowchart: ", error);
//     res.status(500).send("Failed to upload flowchart: " + error.message);
//   }
// });

// Fetch majors by catalog or both by catalog and majorName
router.get("/", async (req, res) => {
  const { catalog, majorName, code } = req.query;
  const result = await searchFlowInfo(catalog, majorName, code);
  res.status(200).json(result);
});
export default router;
