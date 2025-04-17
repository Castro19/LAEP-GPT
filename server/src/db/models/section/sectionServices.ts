/* eslint-disable @typescript-eslint/no-explicit-any */
// Store the course catalog data in MongoDB

import {
  CourseTerm,
  Section,
  SectionDocument,
  SectionsFilterParams,
} from "@polylink/shared/types";
import * as sectionCollection from "./sectionCollection";
import { Filter } from "mongodb";
import { environment } from "../../..";
import { buildNonConflictingQuery } from "../../../helpers/queryBuilders/scheduling";
import { fetchPrimarySchedule } from "../schedule/scheduleServices";
import * as summerSectionCollection from "./summerSectionCollection";
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
    const status = filter.status.toLowerCase();

    if (status === "open") {
      query.enrollmentStatus = "O";
    } else if (status === "closed") {
      query.enrollmentStatus = "C";
    } else if (status === "waitlist" || status === "waitlisted") {
      query.enrollmentStatus = "W";
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
  // 6a. Parse min/max rating if provided.
  if (filter.minInstructorRating && filter.maxInstructorRating) {
    const minRating = parseFloat(filter.minInstructorRating);
    const maxRating = parseFloat(filter.maxInstructorRating);

    // 6b. Ensure these are valid numbers; adjust any conditions you need here.
    if (!isNaN(minRating) && !isNaN(maxRating)) {
      // 6c. If we also want to include unrated instructors
      //    we need an OR condition:
      if (filter.includeUnratedInstructors) {
        query["$or"] = [
          {
            // *Rated* instructors in the given range
            instructorsWithRatings: {
              $elemMatch: {
                overallRating: {
                  $gte: minRating,
                  $lte: maxRating,
                },
              },
            },
          },
          {
            // *Unrated* instructors: array is missing entirely
            instructorsWithRatings: {
              $exists: false,
            },
          },
          {
            // *Unrated* instructors: array is present but empty
            instructorsWithRatings: {
              $size: 0,
            },
          },
        ];
      } else {
        // 6d. If we only want instructors that have a rating in the range
        query["instructorsWithRatings"] = {
          $elemMatch: {
            overallRating: {
              $gte: minRating,
              $lte: maxRating,
            },
          },
        };
      }
    }
  }
  // 6e. If only `includeUnratedInstructors` is true with *no* min/max rating
  //    you can include a separate condition if desired.
  else if (filter.includeUnratedInstructors) {
    // For example, include *all* rated in any range plus *all* unrated
    // or only show *unrated*. Depends on your business logic.
    query["$or"] = [
      { instructorsWithRatings: { $exists: false } },
      { instructorsWithRatings: { $size: 0 } },
      // Or if you want *all* (including rated):
      {},
    ];
  }

  // 7) units (e.g., "1-4")
  if (filter.minUnits && filter.maxUnits) {
    const minUnits = parseInt(filter.minUnits, 10);
    const maxUnits = parseInt(filter.maxUnits, 10);

    if (!isNaN(minUnits) && !isNaN(maxUnits)) {
      query.$expr = {
        $and: [
          // Check if unit's lower bound >= minUnits
          {
            $gte: [
              {
                $cond: [
                  { $regexMatch: { input: "$units", regex: / - / } },
                  {
                    $toInt: {
                      $trim: {
                        input: {
                          $arrayElemAt: [{ $split: ["$units", " - "] }, 0],
                        },
                      },
                    },
                  },
                  { $toInt: "$units" },
                ],
              },
              minUnits,
            ],
          },
          // Check if unit's upper bound <= maxUnits
          {
            $lte: [
              {
                $cond: [
                  { $regexMatch: { input: "$units", regex: / - / } },
                  {
                    $toInt: {
                      $trim: {
                        input: {
                          $arrayElemAt: [{ $split: ["$units", " - "] }, 1],
                        },
                      },
                    },
                  },
                  { $toInt: "$units" },
                ],
              },
              maxUnits,
            ],
          },
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
  if (filter.instructors) {
    query.instructors = {
      $elemMatch: { name: { $in: filter.instructors } },
    };
  }

  // 11) techElectives

  if (filter.isTechElective === true && filter.techElectives) {
    if (environment === "dev") {
      console.log("filter.techElectives", filter.techElectives);
    }
    if (!filter.techElectives.concentration) {
      query.techElectives = { $in: [filter.techElectives.major] };
    } else {
      // Ensure the concentration string is present in the techElectives array
      query.techElectives = { $in: [filter.techElectives.concentration] };
    }
  }
  // 12) classNumber
  if (filter.classNumber) {
    query.classNumber = parseInt(filter.classNumber, 10);
  }
  console.log("filter.minCatalogNumber", filter.minCatalogNumber);
  // 13) minCatalogNumber (e.g. "100")
  // 12) classNumber
  if (filter.classNumber) {
    query.classNumber = parseInt(filter.classNumber, 10);
  }

  // 13 & 14) minCatalogNumber and maxCatalogNumber
  if (filter.minCatalogNumber || filter.maxCatalogNumber) {
    query.$expr = { $and: [] };

    if (filter.minCatalogNumber) {
      query.$expr.$and.push({
        $gte: [
          { $toInt: { $trim: { input: "$catalogNumber" } } },
          parseInt(filter.minCatalogNumber, 10),
        ],
      });
    }

    if (filter.maxCatalogNumber) {
      query.$expr.$and.push({
        $lte: [
          { $toInt: { $trim: { input: "$catalogNumber" } } },
          parseInt(filter.maxCatalogNumber, 10),
        ],
      });
    }
  }

  // 15) isCreditNoCredit
  if (filter.isCreditNoCredit) {
    query.isCreditNoCredit = filter.isCreditNoCredit;
  }
  return query;
}

/**
 * Get sections by arbitrary filters.
 */
export async function getSectionsByFilter(
  filter: SectionsFilterParams,
  userId: string,
  skip = 0,
  limit = 25
): Promise<{ sections: Section[]; total: number }> {
  try {
    let query = buildSectionsQuery(filter);
    if (filter.withNoConflicts) {
      const schedule = await fetchPrimarySchedule(userId, filter.term);

      if (schedule) {
        // 1) Build the "no-conflict" portion
        const noConflictQuery = buildNonConflictingQuery(schedule);

        // 2) If the user actually has meeting times (i.e. noConflictQuery isn't empty),
        //    then combine the two queries under $and
        if (Object.keys(noConflictQuery).length > 0) {
          query = {
            $and: [query, noConflictQuery],
          };
        } else {
          query = {
            ...query,
            ...noConflictQuery,
          };
        }
      }
    }

    if (environment === "dev") {
      console.log("query", query);
    }
    if (filter.term === "summer2025") {
      return await summerSectionCollection.findSectionsByFilter(
        query,
        skip,
        limit
      );
    } else {
      // Perform the find operation with skip & limit
      // and also get a total count so you can return that in the response
      return await sectionCollection.findSectionsByFilter(query, skip, limit);
    }
  } catch (error) {
    if (environment === "dev") {
      console.error("Error searching sections by filter:", error);
    }
    return { sections: [], total: 0 };
  }
}

export async function getSectionsbyProjection(
  classNumbers: (string | number)[],
  fields: (
    | "courseId"
    | "courseName"
    | "description"
    | "units"
    | "enrollmentStatus"
    | "courseAttributes"
    | "meetings"
    | "instructors"
    | "instructorWithRatings"
  )[]
): Promise<Partial<Section>[]> {
  // Convert classNumbers to numbers if they are strings
  const numericClassNumbers = classNumbers.map((num) => Number(num));

  const query = { classNumber: { $in: numericClassNumbers } };

  // Construct the projection object with fields set to 1
  const projection = fields.reduce(
    (acc, field) => {
      acc[field] = 1;
      return acc;
    },
    {} as Record<string, 1>
  );

  return await sectionCollection.findSectionsbyProjection(query, projection);
}

/**
 * Get a section by its class number.
 * @param classNumber The class number of the section to find.
 * @returns The section with the given class number, or null if not found.
 */
export async function getSectionById(
  classNumber: number,
  term: CourseTerm
): Promise<Section | null> {
  try {
    const query = { classNumber };
    if (term === "summer2025") {
      const result = await summerSectionCollection.findSectionsByFilter(
        query,
        0,
        1
      );
      return result.sections.length > 0 ? result.sections[0] : null;
    } else {
      const result = await sectionCollection.findSectionsByFilter(query, 0, 1);
      return result.sections.length > 0 ? result.sections[0] : null;
    }
  } catch (error) {
    if (environment === "dev") {
      console.error(`Error fetching section ${classNumber}:`, error);
    }
    return null;
  }
}

/*
minUnits: "1"
maxUnits: "4"

$units: "2 - 3"

good: 2 >= 1 && 3 <= 4
*/
