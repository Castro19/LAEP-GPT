import express from "express";
import {
  createCourses,
  getCourses,
  getSubjectNames,
  getCoursesBySubject,
  getCourse,
} from "../db/models/courses/courseServices.js";
const router = express.Router();

// Post All courses
router.post("/", async (req, res) => {
  try {
    const result = await createCourses();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send("Failed to create courses: " + error.message);
  }
});

// Query courses by catalog year and search term
router.get("/", async (req, res) => {
  try {
    console.log("req: ", req.query);
    const result = await getCourses(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to get courses:", error);
    res.status(500).send("Failed to get courses: " + error.message);
  }
});

// New route to get courses categorized by subject

router.get("/subjectNames", async (req, res) => {
  try {
    const result = await getSubjectNames(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to get courses by subject:", error);
    res.status(500).send("Failed to get courses: " + error.message);
  }
});

router.get("/subject", async (req, res) => {
  try {
    const result = await getCoursesBySubject(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to get courses by subject:", error);
    res.status(500).send("Failed to get courses: " + error.message);
  }
});

router.get("/course", async (req, res) => {
  try {
    const result = await getCourse(req.query);
    console.log("result: ", result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to get course:", error);
    res.status(500).send("Failed to get course: " + error.message);
  }
});
export default router;
