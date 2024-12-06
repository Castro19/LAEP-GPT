import express from "express";
import { searchFlowInfo } from "../db/models/flowInfo/flowInfoServices.js";

const router = express.Router();

type FlowInfoQuery = {
  catalog: string | undefined;
  majorName: string | undefined;
};
// Fetch majors by catalog or both by catalog and majorName
router.get("/", async (req, res) => {
  const { catalog, majorName } = req.query as FlowInfoQuery;
  const result = await searchFlowInfo({ catalog, majorName, code: undefined });
  res.status(200).json(result);
});
export default router;
