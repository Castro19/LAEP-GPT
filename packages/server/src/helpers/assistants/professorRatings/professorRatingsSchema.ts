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

export type ProfessorRatingsResponse = {
  results: {
    type: "professor" | "courses" | "both" | "fallback";
    courses: string[] | null;
    professors: string[] | null;
    reason: string | null;
  }[];
} | null;
