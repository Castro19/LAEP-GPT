import { z } from "zod";

/** Common operators for string fields: $eq, $ne, $in, $nin, $regex, $options, etc. */
const StringOperators = z.object({
  $eq: z.string().optional(),
  $ne: z.string().optional(),
  $in: z.array(z.string()).optional(),
  $nin: z.array(z.string()).optional(),
  $regex: z.string().optional(), // e.g. { description: { $regex: "systems" } }
  $options: z.string().optional(), // e.g. { $regex: "systems", $options: "i" }
  $exists: z.boolean().optional(),
});

/** Common operators for numeric fields: $eq, $ne, $gte, $lte, $in, $nin, etc. */
const NumberOperators = z.object({
  $eq: z.number().optional(),
  $ne: z.number().optional(),
  $in: z.array(z.number()).optional(),
  $nin: z.array(z.number()).optional(),
  $gte: z.number().optional(),
  $lte: z.number().optional(),
  $gt: z.number().optional(),
  $lt: z.number().optional(),
  $exists: z.boolean().optional(),
});

/** Common operators for boolean fields. */
const BooleanOperators = z.object({
  $eq: z.boolean().optional(),
  $ne: z.boolean().optional(),
  $in: z.array(z.boolean()).optional(),
  $nin: z.array(z.boolean()).optional(),
  $exists: z.boolean().optional(),
});

/** A field that is typically a string but can also take string operators. */
const StringField = z.union([z.string(), StringOperators]);

/** A field that is typically a number but can also take number operators. */
const NumberField = z.union([z.number(), NumberOperators]);

/** A field that is typically a boolean but can also take boolean operators. */
const BooleanField = z.union([z.boolean(), BooleanOperators]);

/**
 * For enumerated strings, we allow either the direct value (e.g. "O")
 * or a string operator object (e.g. { "$in": ["O", "C"] }).
 */
const EnrollmentStatusField = z.union([
  z.enum(["O", "C", "W"]),
  StringOperators,
]);

const InstructionModeField = z.union([
  z.enum(["PA", "SM", "P", "PS", "AM", "SA"]),
  StringOperators,
]);

/**
 * For arrays of known strings, e.g. courseAttributes or techElectives,
 * we can allow direct array or an operator approach ($all, $in, etc.).
 */
const StringArrayField = z.union([
  z.array(z.string()),
  z.object({
    $all: z.array(z.string()).optional(),
    $in: z.array(z.string()).optional(),
    $nin: z.array(z.string()).optional(),
    $size: z.number().optional(),
    $elemMatch: z.any().optional(),
    $exists: z.boolean().optional(),
  }),
]);

/**
 * The enrollment object: we allow each field to be either
 * a direct number or a number-operator object.
 */
const EnrollmentObject = z.object({
  waitTotal: NumberField.optional(),
  waitCap: NumberField.optional(),
  classCapacity: NumberField.optional(),
  enrollmentTotal: NumberField.optional(),
  enrollmentAvailable: NumberField.optional(),
  enrollmentStatusDescription: StringField.optional(),
});

const MeetingObject = z.object({
  days: z.array(z.enum(["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"])).optional(),
  start_time: StringField.optional(),
  end_time: StringField.optional(),
  location: StringField.optional(),
});

const MeetingsField = z.union([
  // Possibly direct array of MeetingObject
  z.array(MeetingObject),
  // Or using $elemMatch:
  z.object({
    $elemMatch: z.any().optional(), // If you want to allow nested logic
  }),
]);

const InstructorRatingsObject = z.object({
  name: StringField.optional(),
  id: StringField.optional(),
  courseId: StringField.optional(),
  overallRating: NumberField.optional(),
  numEvals: NumberField.optional(),
  courseRating: NumberField.optional(),
  studentDifficulties: NumberField.optional(),
});

const InstructorsWithRatingsField = z.union([
  // Possibly a direct array of instructor objects:
  z.array(InstructorRatingsObject),
  // Or usage of $elemMatch:
  z.object({
    $elemMatch: z.any().optional(),
  }),
]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SectionFilterSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      // Top-level logical operators:
      $and: z.array(SectionFilterSchema).optional(),
      $or: z.array(SectionFilterSchema).optional(),
      $nor: z.array(SectionFilterSchema).optional(),

      // Mapped fields from the "Section" type:
      classNumber: NumberField.optional(),
      courseId: StringField.optional(),
      subject: StringField.optional(),
      catalogNumber: StringField.optional(),
      component: StringField.optional(),
      courseName: StringField.optional(),
      description: StringField.optional(),
      prerequisites: z
        .union([
          z.array(z.string()), // e.g. direct array ["CSC101","CSC102"]
          z.object({
            // Common array operators
            $all: z.array(z.string()).optional(),
            $in: z.array(z.string()).optional(),
            $nin: z.array(z.string()).optional(),
            $size: z.number().optional(),
            $elemMatch: z.any().optional(),
            $exists: z.boolean().optional(),
          }),
        ])
        .optional(),
      units: StringField.optional(), // e.g. "3" or { $regex: "3-" }

      enrollmentStatus: EnrollmentStatusField.optional(),
      enrollment: z
        .union([
          EnrollmentObject,
          // Or an operator object if the user wants $elemMatch or $exists at the top
          z.object({
            $elemMatch: z.any().optional(),
            $exists: z.boolean().optional(),
          }),
        ])
        .optional(),

      instructionMode: InstructionModeField.optional(),
      courseAttributes: StringArrayField.optional(),
      meetings: MeetingsField.optional(),
      instructors: z
        .union([
          // Possibly direct array
          z.array(
            z.object({
              name: StringField.optional(),
              email: StringField.optional(),
            })
          ),
          // Or $elemMatch usage
          z.object({ $elemMatch: z.any().optional() }),
        ])
        .optional(),
      instructorsWithRatings: InstructorsWithRatingsField.optional(),
      techElectives: StringArrayField.optional(),
      classPair: NumberField.optional(),
      isCreditNoCredit: BooleanField.optional(),
    })
    // If you want to allow unknown fields or further dynamic usage:
    .catchall(z.any())
);

export const FilterSectionsSchema = z.object({
  name: z.literal("filter_sections"),
  arguments: z.object({
    // This is the main query:
    query: SectionFilterSchema,
    // Explanation: short text
    explanation: z.string().max(200),
  }),
});

// Security-focused schema configuration
const ForbiddenPatterns = z.string().refine(
  // eslint-disable-next-line no-control-regex
  (val) => !/[;$\\|<>\\/\x00-\x1F]/.test(val),
  "Contains forbidden characters"
);

const MaxDepthSchema = z.any().superRefine((val, ctx) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const checkDepth = (obj: any, depth = 0): void => {
    if (depth > 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Object nesting too deep (max 5 levels)",
      });
    }

    if (typeof obj === "object" && obj !== null) {
      Object.values(obj).forEach((v) => checkDepth(v, depth + 1));
    }
  };

  checkDepth(val);
});

export const SafeQuerySchema = z
  .union([
    z.object({}).passthrough().and(MaxDepthSchema).and(ForbiddenPatterns),
    z.array(z.any()).max(100),
    z.record(z.any()),
  ])
  .refine(
    (data) => {
      const json = JSON.stringify(data);
      return json.length <= 5000 && !/(\\u0000|\\u001b|\\u009b)/.test(json);
    },
    { message: "Query exceeds security limits" }
  );
