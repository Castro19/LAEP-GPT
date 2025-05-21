import { SectionsFilterParams } from "@polylink/shared/types";
import { z } from "zod";

// Days allowed (used in the Zod enum)
export const DAYS = ["Mo", "Tu", "We", "Th", "Fr"] as const;

// Potential Course Attributes
export const COURSE_ATTRIBUTES = [
  "GE A",
  "GE B",
  "GE C",
  "GE D",
  "GWR",
  "USCP",
] as const;

const COURSE_TERMS = ["spring2025", "summer2025", "fall2025"] as const;
export const HOURS = Array.from({ length: 14 }, (_, i) => i + 7);

export const SECTION_FILTERS_SCHEMA = z.object({
  term: z.enum(COURSE_TERMS).optional(),
  courseIds: z.array(z.string()).optional(),
  status: z.string().optional(),
  subject: z.string().optional(),
  // The "days" field is an array of allowed day strings.
  days: z.array(z.enum(DAYS)).optional(),
  // Capture start and end times separately.
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  minInstructorRating: z.string().optional(),
  maxInstructorRating: z.string().optional(),
  includeUnratedInstructors: z.boolean().optional(),
  minUnits: z.string().optional(),
  maxUnits: z.string().optional(),
  minCatalogNumber: z.string().optional(),
  maxCatalogNumber: z.string().optional(),
  // Allow multiple course attributes
  courseAttributes: z.array(z.enum(COURSE_ATTRIBUTES)).optional(),
  instructionMode: z
    .string(z.enum(["P", "A", "AM", "PS", "SA", "SM"]))
    .optional(),
  instructors: z.array(z.string()).optional(),
  isTechElective: z.boolean().optional(),
  techElectives: z
    .object({
      major: z.string(),
      concentration: z.string(),
    })
    .optional(),
  withTimeConflicts: z.boolean().optional(),
  isCreditNoCredit: z.boolean().optional(),
});

export const SCHEDULE_PREFERENCES_SCHEMA = z.object({
  minUnits: z.string().optional(),
  maxUnits: z.string().optional(),
  minInstructorRating: z.string().optional(),
  maxInstructorRating: z.string().optional(),
  openOnly: z.boolean().optional(),
  withTimeConflicts: z.boolean().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

// Utility function to get initial filter values
export const getInitialFilterValues = (
  major = "",
  concentration = ""
): SectionsFilterParams => {
  return {
    term: "fall2025",
    courseIds: [],
    status: "",
    subject: "",
    days: "",
    timeRange: "",
    minInstructorRating: "",
    maxInstructorRating: "",
    includeUnratedInstructors: undefined,
    minUnits: "",
    maxUnits: "",
    minCatalogNumber: "",
    maxCatalogNumber: "",
    courseAttribute: [],
    instructionMode: "",
    instructors: [],
    isTechElective: false,
    techElectives: {
      major,
      concentration,
    },
    withTimeConflicts: true,
    isCreditNoCredit: false,
  };
};
