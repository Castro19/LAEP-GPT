/* eslint-disable @typescript-eslint/no-explicit-any */
// Store the course catalog data in MongoDB

import {
  Section,
  SectionDocument,
  SectionsFilterParams,
} from "@polylink/shared/types";
import { findSectionsByFilter } from "./sectionCollection";
import { Filter } from "mongodb";
/**
 * Build a filter object that can be passed to the collection query.
 */
function buildSectionsQuery(
  filter: SectionsFilterParams
): Filter<SectionDocument> {
  const query: any = {};

  // 1) subject
  if (filter.subject) {
    query.subject = filter.subject; // exact match
  }

  // 2) courseId
  if (filter.courseIds) {
    query.courseId = { $in: filter.courseIds }; // exact match
  }

  // 3) status (open/closed → O/C)
  if (filter.status) {
    if (filter.status.toLowerCase() === "open") {
      query.enrollmentStatus = "O";
    } else if (filter.status.toLowerCase() === "closed") {
      query.enrollmentStatus = "C";
    }
  }

  // 4) days (e.g. "Mo,Tu,We")
  if (filter.days) {
    const dayList = filter.days.split(",").map((day) => day.trim());

    // Ensure that meetings.days does not contain any days not in dayList and is not empty
    query["meetings.days"] = {
      $not: {
        $elemMatch: { $nin: dayList },
      },
      $exists: true,
      $ne: [],
    };
  }

  // 5) timeRange (e.g. "08:00:00-10:00:00")
  //    If stored as zero-padded strings "HH:MM:SS", we can do a simple lexical $gte/$lte:
  if (filter.timeRange) {
    const [start, end] = filter.timeRange.split("-");
    if (start && end) {
      // Convert filter times to match database format (appending ":00")
      const startTime = `${start}:00`;
      const endTime = `${end}:00`;

      query["meetings"] = {
        $exists: true, // Ensures sections without meetings are excluded
        $ne: [], // Excludes sections with an empty 'meetings' array
        $not: {
          $elemMatch: {
            $or: [
              { start_time: { $lt: startTime } }, // If any meeting starts before the range
              { end_time: { $gt: endTime } }, // If any meeting ends after the range
            ],
          },
        },
      };
    }
  }

  // 6) instructorRating
  //    e.g. ">=3.5" or "3.5"? For simplicity, let's assume it's always "3.5" meaning ">= 3.5".
  if (filter.instructorRating) {
    const rating = parseFloat(filter.instructorRating);
    if (!isNaN(rating) && rating > 0) {
      // We want at least one instructorWithRatings whose overallRating >= rating
      query["instructorsWithRatings"] = {
        $elemMatch: { overallRating: { $gte: rating } },
      };
    }
  }

  // 7) units (e.g., 1, 2, 3, 4, 5, 6)
  //    Because `units` in the schema is a string, you'll have to decide how it's stored.
  if (filter.units) {
    const filterUnits = parseInt(filter.units, 10);

    if (!isNaN(filterUnits)) {
      query.$expr = {
        $lte: [
          {
            $cond: [
              // Check if the units string contains " - " (with spaces)
              { $regexMatch: { input: "$units", regex: / - / } },
              {
                // For ranges like "1 - 4", split using " - ", trim the second element, and convert to an int.
                $toInt: {
                  $trim: {
                    input: {
                      $arrayElemAt: [{ $split: ["$units", " - "] }, 1],
                    },
                  },
                },
              },
              {
                // Otherwise, assume it's a single number and convert directly.
                $toInt: "$units",
              },
            ],
          },
          filterUnits, // Only match courses whose max units is <= filterUnits.
        ],
      };
    }
  }

  // 8) courseAttribute
  //    "courseAttributes" is an array. If we want a doc that has the given attribute in its array:
  if (filter.courseAttribute) {
    // Ensure every item in filter.courseAttribute is present in courseAttributes
    query.courseAttributes = { $all: filter.courseAttribute };
  }

  if (filter.instructionMode) {
    let allowedCodes: string[] = [];

    if (filter.instructionMode.includes("P")) {
      allowedCodes = allowedCodes.concat(["P", "PS", "AM"]);
    }
    if (filter.instructionMode.includes("A")) {
      allowedCodes = allowedCodes.concat(["PA", "SM", "SA"]);
    }

    // Ensure there are no duplicates (if that matters)
    allowedCodes = Array.from(new Set(allowedCodes));

    query.instructionMode = { $in: allowedCodes };
  }

  // 10) instructor
  if (filter.instructor) {
    query.instructorsWithRatings = {
      $elemMatch: { instructor: filter.instructor },
    };
  }

  return query;
}

/**
 * Get sections by arbitrary filters.
 */
export async function getSectionsByFilter(
  filter: SectionsFilterParams,
  skip = 0,
  limit = 25
): Promise<{ sections: Section[]; total: number }> {
  try {
    const query = buildSectionsQuery(filter);
    // Perform the find operation with skip & limit
    // and also get a total count so you can return that in the response
    return await findSectionsByFilter(query, skip, limit);
  } catch (error) {
    console.error("Error searching sections by filter:", error);
    return { sections: [], total: 0 };
  }
}
