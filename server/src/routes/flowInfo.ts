/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import {
  getFlowInfoByCode,
  searchFlowInfo,
} from "../db/models/flowInfo/flowInfoServices";

const router = express.Router();

type FlowInfoQuery = {
  catalog: string | undefined;
  majorName: string | undefined;
  code: string | undefined;
};

router.get("/", async (req: any, res: any) => {
  const { catalog, majorName } = req.query as FlowInfoQuery;
  try {
    const result = await searchFlowInfo({
      catalog,
      majorName,
      code: undefined,
    });
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching flow info:", error);
    res.status(500).json({ error: "Failed to get flow info" });
  }
});

export default router;
