import express from "express";
import { getSectionsByFilter } from "../db/models/section/sectionServices"; // new function
import { CustomRequest as Request } from "../types/express";
import { SectionDocument, SectionsFilterParams } from "@polylink/shared/types";
import { environment } from "../index";
import { findSectionsByFilter } from "../db/models/section/sectionCollection";
import { Filter } from "mongodb";
import { QuerySchema } from "../helpers/assistants/queryAgent";

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
      minUnits, // e.g., "1"
      maxUnits, // e.g., "6"
      courseAttribute, // e.g., "GWR"
      instructionMode, // e.g., "P" or "PS" or "PA", etc.
      instructors, // e.g., ["John Doe", "Jane Doe"]
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
      minUnits: minUnits as string,
      maxUnits: maxUnits as string,
      courseAttribute:
        typeof courseAttribute === "string"
          ? (courseAttribute.split(
              ","
            ) as SectionsFilterParams["courseAttribute"])
          : (courseAttribute as SectionsFilterParams["courseAttribute"]),
      instructionMode:
        instructionMode as SectionsFilterParams["instructionMode"],
      instructors:
        typeof instructors === "string"
          ? (instructors as string).split(",")
          : (instructors as string[]),
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
    if (environment === "dev") {
      console.error("Error fetching sections:", error);
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.post("/query", async (req, res: any) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).send("Unauthorized");
      return;
    }
    const { query, page } = req.body; // Change from req.query to req.body

    // Validate the filterQuery using Zod
    const validationResult = QuerySchema.safeParse(query);
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Invalid query",
        errors: validationResult.error.errors,
      });
    }

    const pageNumber = parseInt(page as string, 10) || 1;
    const PAGE_SIZE = 25;
    const skip = (pageNumber - 1) * PAGE_SIZE;

    // Assuming the query is already a valid JSON object
    const filterQuery = query;

    // Validate the filterQuery
    const { sections, total } = await findSectionsByFilter(
      filterQuery as Filter<SectionDocument>,
      skip,
      PAGE_SIZE
    );
    return res.status(200).json({
      data: sections,
      total,
      page: pageNumber,
      pageSize: PAGE_SIZE,
      totalPages: Math.ceil(total / PAGE_SIZE),
    });
  } catch (error) {
    console.error("Error querying sections:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
