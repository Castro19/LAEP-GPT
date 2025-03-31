/**
 * A Zod schema that matches:
 *
 * {
 *   "name": "professor_ratings_schema",
 *   "schema": {
 *     "type": "object",
 *     "properties": {
 *       "results": {
 *         "type": "array",
 *         "items": {
 *           "type": "object",
 *           "properties": {
 *             "type": { "type": "string", "enum": [...] },
 *             "courses": { "type": ["array", "null"], "items": { "type": "string" } },
 *             "professors": { "type": ["array", "null"], "items": { "type": "string" } },
 *             "reason": { "type": ["string", "null"] }
 *           },
 *           "required": ["type", "courses", "professors", "reason"],
 *           "additionalProperties": false
 *         }
 *       }
 *     },
 *     "required": ["results"],
 *     "additionalProperties": false
 *   }
 * }
 */
// export const ProfessorRatingsSchema = z.array(
//   z
//     .object({
//       type: z.enum(["professor", "courses", "both", "fallback"]),
//       courses: z.array(z.string()).nullable(),
//       professors: z.array(z.string()).nullable(),
//       reason: z.string().nullable(),
//     })
//     .strict()
// );
export const ProfessorRatingsSchema = {
  type: "object",
  properties: {
    results: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["professor", "courses", "both", "fallback"],
          },
          courses: { type: ["array", "null"], items: { type: "string" } },
          professors: { type: ["array", "null"], items: { type: "string" } },
          reason: { type: ["string", "null"] },
        },
        required: ["type", "courses", "professors", "reason"],
        additionalProperties: false,
      },
    },
  },
  required: ["results"],
  additionalProperties: false,
};

/*
example:
    schema: {
        type: "object",
        properties: {
          name: { 
            type: "string" 
          },
          date: { 
            type: "string" 
          },
          participants: { 
            type: "array", 
            items: { 
              type: "string" 
            } 
          },
        },
        required: ["name", "date", "participants"],
        additionalProperties: false,
      },
    }
  }
*/
