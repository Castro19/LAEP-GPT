import express from "express";
import {
  getCourses,
  getSubjectNames,
  getCoursesBySubject,
  getCourse,
} from "../db/models/courses/courseServices";
import { SubjectQuery } from "@polylink/shared/types";
import { environment } from "../index";
const router = express.Router();

// Query courses by catalog year and search term
router.get("/", async (req, res) => {
  try {
    const result = await getCourses(req.query);
    res.status(200).json(result);
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to get courses:", error);
    }
    res.status(500).send("Failed to get courses: " + (error as Error).message);
  }
});

// New route to get courses categorized by subject

router.get("/subjectNames", async (req, res) => {
  try {
    const result = await getSubjectNames(req.query as SubjectQuery);
    res.status(200).json(result);
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to get courses by subject:", error);
    }
    res.status(500).send("Failed to get courses: " + (error as Error).message);
  }
});

router.get("/subject", async (req, res) => {
  try {
    const result = await getCoursesBySubject(req.query as SubjectQuery);
    res.status(200).json(result);
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to get courses by subject:", error);
    }
    res.status(500).send("Failed to get courses: " + (error as Error).message);
  }
});

router.get("/course", async (req, res) => {
  try {
    const result = await getCourse(req.query);

    res.status(200).json(result);
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to get course:", error);
    }
    res.status(500).send("Failed to get course: " + (error as Error).message);
  }
});

export default router;
