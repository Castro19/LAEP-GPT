/* eslint-disable @typescript-eslint/no-explicit-any */
// Store the course catalog data in MongoDB

import { Section, SectionsFilterParams } from "@polylink/shared/types";
import { findSectionsByFilter } from "./sectionCollection";
/**
 * Build a filter object that can be passed to the collection query.
 */
function buildSectionsQuery(filter: SectionsFilterParams): any {
  const query: any = {};

  // 1) subject
  if (filter.subject) {
    query.subject = filter.subject; // exact match
  }

  // 2) courseId
  if (filter.courseId) {
    query.courseId = filter.courseId; // exact match
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
  //    If we want sections meeting *all* these days, we'd build a $all query.
  //    If we want sections meeting *any* of these days, we'd use $in.
  if (filter.days) {
    const dayList = filter.days.split(",").map((day) => day.trim());
    // "meetings.days": { $in: ["Mo", "Tu", "We"] }
    // This matches any section that has at least one meeting containing any of those days.
    query["meetings.days"] = { $in: dayList };
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
    if (!isNaN(rating)) {
      // We want at least one instructorWithRatings whose overallRating >= rating
      query["instructorsWithRatings"] = {
        $elemMatch: { overallRating: { $gte: rating } },
      };
    }
  }

  // 7) units (e.g., "1-3" or "4+")
  //    Because `units` in the schema is a string, you'll have to decide how it’s stored.
  //    Example approach:
  if (filter.units) {
    if (filter.units.includes("-")) {
      // e.g. "1-3"
      const [min, max] = filter.units.split("-").map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        // units is stored as a string, so we do: parseInt(units) >= min && parseInt(units) <= max
        query.$expr = {
          $and: [
            { $gte: [{ $toInt: "$units" }, min] },
            { $lte: [{ $toInt: "$units" }, max] },
          ],
        };
      }
    } else if (filter.units.endsWith("+")) {
      // e.g. "4+"
      const min = parseInt(filter.units.replace("+", ""));
      if (!isNaN(min)) {
        query.$expr = {
          $gte: [{ $toInt: "$units" }, min],
        };
      }
    }
  }

  // 8) courseAttribute
  //    "courseAttributes" is an array. If we want a doc that has the given attribute in its array:
  if (filter.courseAttribute) {
    query.courseAttributes = filter.courseAttribute;
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
