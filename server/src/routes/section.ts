import express from "express";
import { getSectionsByFilter } from "../db/models/section/sectionServices"; // new function
import { CustomRequest as Request } from "../types/express";
import { SectionsFilterParams } from "@polylink/shared/types";
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
      units, // Max number of units  e.g., 1, 2, 3, 4, 5, 6
      courseAttribute, // e.g., "GWR"
      instructionMode, // e.g., "P" or "PS" or "PA", etc.
      instructor, // e.g., "John Doe"
      minInstructorRating, // e.g., "3.5"
      maxInstructorRating, // e.g., "4.0"
      includeUnratedInstructors, // e.g., true or false
      page = "1", // Default to page 1 if not provided
    } = req.query;

    // Convert page from string to number
    const pageNumber = parseInt(page as string, 10) || 1;
    // We'll always fetch 25 items per page
    const PAGE_SIZE = 25;
    // Calculate how many documents to skip
    const skip = (pageNumber - 1) * PAGE_SIZE;

    // Convert 'courseIds' and 'courseAttribute' to arrays if necessary
    const filterParams: SectionsFilterParams = {
      subject: subject as string,
      courseIds:
        typeof courseIds === "string"
          ? courseIds.split(",")
          : (courseIds as string[]),
      status: status as string,
      days: days as string,
      timeRange: timeRange as string,
      units: units,
      courseAttribute:
        typeof courseAttribute === "string"
          ? (courseAttribute.split(
              ","
            ) as SectionsFilterParams["courseAttribute"])
          : (courseAttribute as SectionsFilterParams["courseAttribute"]),
      instructionMode:
        instructionMode as SectionsFilterParams["instructionMode"],
      instructor: instructor as string,
      minInstructorRating: minInstructorRating as string,
      maxInstructorRating: maxInstructorRating as string,
      includeUnratedInstructors: includeUnratedInstructors as boolean,
    };

    // Call the service with the parsed query object
    const { sections, total } = await getSectionsByFilter(
      filterParams,
      skip,
      PAGE_SIZE
    );

    // Return a paginated response
    return res.status(200).json({
      data: sections,
      total, // total number of documents matching the query
      page: pageNumber,
      pageSize: PAGE_SIZE,
      totalPages: Math.ceil(total / PAGE_SIZE),
    });
  } catch (error) {
    console.error("Error fetching sections:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
