import express from "express";
import { searchFlowInfo } from "../db/models/flowInfo/flowInfoServices";

const router = express.Router();

type FlowInfoQuery = {
  catalog: string | undefined;
  majorName: string | undefined;
  code: string | undefined;
};
//
router.get("/", async (req, res) => {
  const { catalog, majorName } = req.query as FlowInfoQuery;
  const result = await searchFlowInfo({
    catalog,
    majorName,
    code: undefined,
  });
  res.status(200).json(result);
});

export default router;
