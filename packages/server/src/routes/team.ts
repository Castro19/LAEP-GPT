import express, { RequestHandler } from "express";
import { getTeamMembers } from "../db/models/team/teamServices";
const router = express.Router();

router.get("/", (async (req, res) => {
  const teamMembers = await getTeamMembers();
  res.status(200).json(teamMembers);
}) as RequestHandler);

export default router;
