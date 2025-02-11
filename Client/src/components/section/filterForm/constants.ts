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

export const HOURS = Array.from({ length: 14 }, (_, i) => i + 7);

export const SECTION_FILTERS_SCHEMA = z.object({
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
  // Allow multiple course attributes
  courseAttributes: z.array(z.enum(COURSE_ATTRIBUTES)).optional(),
  instructionMode: z.string(z.enum(["P", "A"])).optional(),
  instructors: z.array(z.string()).optional(),
  includeTechElectives: z.boolean().optional(),
});
