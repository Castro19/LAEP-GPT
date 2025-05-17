import express, { RequestHandler } from "express";
import {
  getSelectedSectionsTool,
  getUserNextEligibleSections,
} from "../helpers/assistants/scheduleBuilder/helpers";

const router = express.Router();

// test route
router.get("/", (async (req, res) => {
  res.status(200).json({ message: "Hello, world!" });
}) as RequestHandler);

router.get("/schedule", (async (req, res) => {
  const result = await getSelectedSectionsTool({
    userId: "qiuJz2JJ22WwMPrtBpASYTXglem2",
    term: "fall2025",
  });

  res.status(200).json(result);
}) as RequestHandler);

router.get("/next", (async (req, res) => {
  const result = await getUserNextEligibleSections({
    userId: "qiuJz2JJ22WwMPrtBpASYTXglem2",
    term: "fall2025",
    numCourses: 4,
    sectionsPerCourse: 2,
  });

  res.status(200).json(result);
}) as RequestHandler);
export default router;
