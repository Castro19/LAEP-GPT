import express from "express";
import {
  getProfessorRatings,
  getProfessorsByCourseIds,
} from "../db/models/professorRatings/professorRatingServices.js";
import { helperAssistant } from "../helpers/assistants/helperAssistant.js";
import { searchProfessors } from "../helpers/qdrant/qdrantQuery.js";
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
    res.status(404).send("Failed to get courses: " + error.message);
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
    res.status(404).send("Failed to get courses: " + error.message);
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
    res.status(404).send("Failed to get professors: " + error.message);
  }
});

router.post("/test", async (req, res) => {
  const { message } = req.body;
  let messageToAdd = message;

  const { type, professors, courses } = await helperAssistant(message);
  console.log("type: ", type);
  console.log("professors: ", professors);
  console.log("courses: ", courses);
  let professorIds = [];
  for (const professor of professors) {
    const message = `name: ${professor}; courses: ${courses.join(", ")}`;
    const professorId = await searchProfessors(message, 1);
    professorIds.push(professorId);
  }
  // Query MongoDB for professors & courses
  console.log("professorIds: ", professorIds);
  try {
    const result = await getProfessorRatings(professorIds, courses);
    messageToAdd += `\nProfessor Ratings: ${JSON.stringify(result)}`;
    res
      .status(200)
      .json({ type, professors: professorIds, courses, messageToAdd });
  } catch (error) {
    console.error("Failed to get professors by course IDs:", error);
    res.status(404).send("Failed to get professors: " + error.message);
  }
});

export default router;
