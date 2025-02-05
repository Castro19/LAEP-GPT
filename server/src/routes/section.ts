import express from "express";
import { getSectionsByFilter } from "../db/models/section/sectionServices"; // new function
import { CustomRequest as Request } from "../types/express";
import { Section, SectionsFilterParams } from "@polylink/shared/types";
const router = express.Router();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.get("/", async (req: Request, res: any) => {
  try {
    const {
      subject,
      courseIds, // array of courseIds
      status, // "open" or "closed"
      days, // e.g., "Mo,Tu,We"
      timeRange, // e.g., "08:00:00-10:00:00"
      instructorRating, // e.g., "3.5"
      units, // Max number of units  e.g., 1, 2, 3, 4, 5, 6
      courseAttribute, // e.g., "GWR"
      instructionMode, // e.g., "P" or "PS" or "PA", etc.
      instructor, // e.g., "John Doe"
    } = req.query;

    // Call the service with the parsed query object
    const sections: Section[] = await getSectionsByFilter({
      subject,
      courseIds:
        typeof courseIds === "string" ? courseIds.split(",") : courseIds,
      status,
      days,
      timeRange,
      instructorRating,
      units: units ? Number(units) : undefined,
      courseAttribute:
        typeof courseAttribute === "string"
          ? courseAttribute.split(",")
          : courseAttribute,
      instructionMode,
      instructor,
    } as SectionsFilterParams);

    return res.status(200).json(sections);
  } catch (error) {
    console.error("Error fetching sections:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
