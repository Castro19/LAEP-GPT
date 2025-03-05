import { z } from "zod";

// --------------------------------------------
// 1) Shared Enums & Item Definitions
// --------------------------------------------

/** Valid fields for "sections" collection fetch. */
const SectionFieldsEnum = [
  "classNumber",
  "courseId",
  "subject",
  "catalogNumber",
  "component",
  "courseName",
  "description",
  "prerequisites",
  "units",
  "enrollmentStatus",
  "enrollment",
  "instructionMode",
  "courseAttributes",
  "meetings",
  "instructors",
  "instructorsWithRatings",
  "techElectives",
  "classPair",
] as const;
const SectionFieldsSchema = z.enum(SectionFieldsEnum);

/** Valid fields for "professorRatings" collection fetch. */
const ProfessorFieldsEnum = [
  "overallRating",
  "numEvals",
  "courseRating",
  "studentDifficulties",
  "tags",
  "reviews",
] as const;
const ProfessorFieldsSchema = z.enum(ProfessorFieldsEnum);

/** The "professors" array inside each section object. */
const ProfessorObjectSchema = z
  .object({
    id: z.string().nullable(), // can be null if unknown
    name: z.string(), // professor name is required
  })
  .strict();

/** Each "section" in the sections arrays. */
const SectionItemSchema = z
  .object({
    courseId: z.string(),
    classNumber: z.number(),
    professors: z.array(ProfessorObjectSchema),
  })
  .strict();

// --------------------------------------------
// 2) Sub-schema Definitions (Optional & Strict)
// --------------------------------------------

/**
 * fetchScheduleSections object
 * - 'required' must be a boolean
 * - 'fields' and 'sections' are optional arrays (no default()).
 * - .strict() ensures no extra properties
 */
const FetchScheduleSectionsSchema = z
  .object({
    required: z.boolean(),
    fields: z.array(SectionFieldsSchema).optional(),
    sections: z.array(SectionItemSchema).optional(),
  })
  .strict();

/**
 * fetchAlternativeSections object
 */
const FetchAlternativeSectionsSchema = z
  .object({
    required: z.boolean(),
    fields: z.array(SectionFieldsSchema).optional(),
    sections: z.array(SectionItemSchema).optional(),
  })
  .strict();

/**
 * fetchProfessors object
 */
const FetchProfessorsSchema = z
  .object({
    required: z.boolean(),
    fields: z.array(ProfessorFieldsSchema).optional(),
    sections: z.array(SectionItemSchema).optional(),
  })
  .strict();

// --------------------------------------------
// 3) Top-Level Schedule Analysis Schema
// --------------------------------------------

/**
 * The main schedule builder schema:
 * - queryType (enum) - required
 * - fetchScheduleSections, fetchAlternativeSections, fetchProfessors
 *   are optional. If present, must match the sub-schema.
 * - .strict() disallows unknown keys at this top level.
 */
export const ScheduleAnalysisSchema = z
  .object({
    queryType: z.enum([
      "schedule_review",
      "professor_insights",
      "schedule_analysis",
      "section_optimization",
    ]),
    fetchScheduleSections: FetchScheduleSectionsSchema.optional(),
    fetchAlternativeSections: FetchAlternativeSectionsSchema.optional(),
    fetchProfessors: FetchProfessorsSchema.optional(),
  })
  .strict();
