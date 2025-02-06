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

export const SECTION_FILTERS_SCHEMA = z.object({
  courseIds: z.array(z.string()).optional(),
  status: z.string().optional(),
  subject: z.string().optional(),
  // The "days" field is an array of allowed day strings.
  days: z.array(z.enum(DAYS)).optional(),
  // Capture start and end times separately.
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  instructorRating: z.string().optional(),
  units: z.number().min(1).max(6).optional(),
  // Allow multiple course attributes
  courseAttributes: z.array(z.enum(COURSE_ATTRIBUTES)).optional(),
  instructionMode: z.string(z.enum(["P", "A"])).optional(),
});
