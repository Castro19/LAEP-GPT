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
      // We want at least one meeting whose start_time >= start and end_time <= end
      query["meetings"] = {
        $elemMatch: {
          start_time: { $gte: start },
          end_time: { $lte: end },
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
    console.log("filter.units", filter.units);
    console.log("filter.units type", typeof filter.units);
    if (!isNaN(filter.units)) {
      query.$expr = {
        $gte: [
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
          filter.units, // Only match courses whose max units is <= filterUnits.
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

  // 9) instructionMode
  //    If you store "P", "PS", "PA", etc., just do an equality match:
  if (filter.instructionMode) {
    query.instructionMode = filter.instructionMode;
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
  filter: SectionsFilterParams
): Promise<Section[]> {
  try {
    const query = buildSectionsQuery(filter);
    return await findSectionsByFilter(query);
  } catch (error) {
    console.error("Error searching sections by filter:", error);
    return [];
  }
}
