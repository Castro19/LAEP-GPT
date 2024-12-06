import express from "express";
import {
  getProfessorRatings,
  getProfessorsByCourseIds,
} from "../db/models/professorRatings/professorRatingServices";

const router = express.Router();

// New route to get courses categorized by subject
router.get("/professors/:professorId", async (req, res) => {
  const { professorId } = req.params;
  const professorIdsArray = professorId ? professorId.split(",") : [];
  try {
    const result = await getProfessorRatings(professorIdsArray);
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to get courses by subject:", error);
    res.status(404).send("Failed to get courses: " + (error as Error).message);
  }
});

router.get("/professors/:professorId/:courseId", async (req, res) => {
  const { professorId, courseId } = req.params;
  const professorIdsArray = professorId ? professorId.split(",") : [];
  const courseIdsArray = courseId ? courseId.split(",") : [];
  try {
    console.log("professorIdsArray: ", professorIdsArray);
    console.log("courseIdsArray: ", courseIdsArray);
    const result = await getProfessorRatings(professorIdsArray, courseIdsArray);
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to get courses by subject:", error);
    res.status(404).send("Failed to get courses: " + (error as Error).message);
  }
});

router.get("/courses/:courseIds", async (req, res) => {
  const { courseIds } = req.params;
  const courseIdsArray = courseIds ? courseIds.split(",") : [];
  try {
    const result = await getProfessorsByCourseIds(courseIdsArray);
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to get professors by course IDs:", error);
    res
      .status(404)
      .send("Failed to get professors: " + (error as Error).message);
  }
});

export default router;
