import { environment } from "..";
import express, { RequestHandler } from "express";
import { getInstructors } from "../db/models/instructor/instructorServices";

const router = express.Router();

// Query courses by catalog year and search term
router.get("/", (async (req, res) => {
  const searchTerm = req.query.searchTerm as string;
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log("searchTerm", searchTerm);

    const result = await getInstructors(searchTerm);
    res.status(200).json(result);
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to get instructors:", error);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}) as RequestHandler);

export default router;
