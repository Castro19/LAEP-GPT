import express, { RequestHandler } from "express";
import { getFlowchartSummary } from "../helpers/assistants/scheduleBuilder/helpers";

const router = express.Router();

// test route
router.get("/", (async (req, res) => {
  res.status(200).json({ message: "Hello, world!" });
}) as RequestHandler);

router.get("/flowchart", (async (req, res) => {
  const result = await getFlowchartSummary("userid");

  //   go to this url to see the result of your primary flowchart:
  // http://localhost:4000/test/flowchart
  res.status(200).json(result);
}) as RequestHandler);

export default router;
