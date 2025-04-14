import express from "express";
import {
  getCourses,
  getSubjectNames,
  getCoursesBySubject,
  getCourse,
  getGeCourses,
  getGeAreas,
  getGeSubjects,
  getTechElectiveCourses,
  getTechElectiveInfo,
  getTechElectiveSubjects,
  getTechElectiveCourseDetails,
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

router.get("/ge/areas", async (req, res) => {
  try {
    const { completedCourseIds, catalogYear } = req.query as {
      completedCourseIds: string[];
      catalogYear: string;
    };
    const result = await getGeAreas(catalogYear, completedCourseIds);
    res.status(200).json(result);
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to get GE areas:", error);
    }
    res.status(500).send("Failed to get GE areas: " + (error as Error).message);
  }
});

router.get("/ge/subjects", async (req, res) => {
  try {
    const { completedCourseIds, area, catalogYear } = req.query as {
      completedCourseIds: string[];
      area: string;
      catalogYear: string;
    };
    const result = await getGeSubjects(
      area,
      catalogYear,
      completedCourseIds || []
    );
    res.status(200).json(result);
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to get GE courses:", error);
    }
    res
      .status(500)
      .send("Failed to get GE courses: " + (error as Error).message);
  }
});

router.get("/ge/:subject/:area/:catalogYear", async (req, res) => {
  try {
    const result = await getGeCourses(
      req.params.subject,
      req.params.area,
      req.params.catalogYear
    );
    res.status(200).json(result);
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to get GE courses:", error);
    }
    res
      .status(500)
      .send("Failed to get GE courses: " + (error as Error).message);
  }
});

router.get("/techElective/info/:code", async (req, res) => {
  try {
    const result = await getTechElectiveInfo(req.params.code);
    res.status(200).json(result);
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to get tech elective courses:", error);
    }
    res
      .status(500)
      .send("Failed to get tech elective courses: " + (error as Error).message);
  }
});

router.get("/techElective/subjects/:category/:code", async (req, res) => {
  try {
    // Decode the category parameter to handle spaces and special characters
    const decodedCategory = decodeURIComponent(req.params.category);
    const result = await getTechElectiveSubjects(
      req.params.code,
      decodedCategory
    );
    res.status(200).json(result);
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to get tech elective courses:", error);
    }
    res
      .status(500)
      .send("Failed to get tech elective courses: " + (error as Error).message);
  }
});

router.get("/techElective/:subject/:category/:code", async (req, res) => {
  try {
    // Decode the category parameter to handle spaces and special characters
    const decodedCategory = decodeURIComponent(req.params.category);
    const decodedSubject = decodeURIComponent(req.params.subject);
    const result = await getTechElectiveCourseDetails(
      decodedCategory,
      req.params.code,
      decodedSubject
    );
    res.status(200).json(result);
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to get tech elective course details:", error);
    }
    res
      .status(500)
      .send(
        "Failed to get tech elective course details: " +
          (error as Error).message
      );
  }
});

router.get("/techElective/:subject/:category/:code", async (req, res) => {
  try {
    // Decode the category parameter to handle spaces and special characters
    const decodedCategory = decodeURIComponent(req.params.category);
    const decodedSubject = decodeURIComponent(req.params.subject);
    const result = await getTechElectiveCourses(
      decodedCategory,
      req.params.code,
      decodedSubject
    );
    res.status(200).json(result);
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to get tech elective courses:", error);
    }
    res
      .status(500)
      .send("Failed to get tech elective courses: " + (error as Error).message);
  }
});

export default router;
