import express from "express";
import {
  getCourses,
  getSubjectNames,
  getCoursesBySubject,
  getCourse,
} from "../db/models/courses/courseServices";
import { SubjectQuery } from "@polylink/shared/types";
const router = express.Router();

router.get("/test", (req, res) => {
  res.status(200).send("Hello World");
});
// Query courses by catalog year and search term
router.get("/", async (req, res) => {
  try {
    console.log("req: ", req.query);
    const result = await getCourses(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to get courses:", error);
    res.status(500).send("Failed to get courses: " + (error as Error).message);
  }
});

// New route to get courses categorized by subject

router.get("/subjectNames", async (req, res) => {
  try {
    const result = await getSubjectNames(req.query as SubjectQuery);
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to get courses by subject:", error);
    res.status(500).send("Failed to get courses: " + (error as Error).message);
  }
});

router.get("/subject", async (req, res) => {
  try {
    const result = await getCoursesBySubject(req.query as SubjectQuery);
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to get courses by subject:", error);
    res.status(500).send("Failed to get courses: " + (error as Error).message);
  }
});

router.get("/course", async (req, res) => {
  try {
    const result = await getCourse(req.query);
    console.log("result: ", result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to get course:", error);
    res.status(500).send("Failed to get course: " + (error as Error).message);
  }
});

export default router;
