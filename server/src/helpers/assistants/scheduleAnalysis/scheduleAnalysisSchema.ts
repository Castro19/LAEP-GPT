export const ScheduleAnalysisSchema = {
  type: "object",
  properties: {
    queryType: {
      type: "string",
      enum: [
        "schedule_review",
        "professor_insights",
        "schedule_analysis",
        "section_optimization",
      ],
      description: "Indicates the overall type of user query.",
    },
    fetchScheduleSections: {
      type: "object",
      properties: {
        required: {
          type: "boolean",
          description: "Whether we need to fetch existing scheduled sections.",
        },
        fields: {
          type: "array",
          description:
            "Specific fields to fetch from the 'sections' collection for these schedule sections.",
          items: {
            type: "string",
            enum: [
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
            ],
          },
        },
        sections: {
          type: "array",
          description: "Which sections to fetch or analyze in the schedule.",
          items: {
            type: "object",
            properties: {
              courseId: {
                type: "string",
              },
              classNumber: {
                type: "number",
              },
              professors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                    },
                    name: {
                      type: "string",
                    },
                  },
                  required: ["id", "name"],
                  additionalProperties: false,
                },
              },
            },
            required: ["courseId", "classNumber", "professors"],
            additionalProperties: false,
          },
        },
      },
      required: ["required", "fields", "sections"],
      additionalProperties: false,
      strict: true,
    },
    fetchAlternativeSections: {
      type: "object",
      properties: {
        required: {
          type: "boolean",
          description:
            "Whether we need to find alternative sections for conflict resolution or better options.",
        },
        fields: {
          type: "array",
          description:
            "Specific fields needed to identify or evaluate alternatives in the 'sections' collection.",
          items: {
            type: "string",
            enum: [
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
            ],
          },
        },
        sections: {
          type: "array",
          description: "Which sections the user wants alternatives for.",
          items: {
            type: "object",
            properties: {
              courseId: {
                type: "string",
              },
              classNumber: {
                type: "number",
              },
              professors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                    },
                    name: {
                      type: "string",
                    },
                  },
                  required: ["id", "name"],
                  additionalProperties: false,
                },
              },
            },
            required: ["courseId", "classNumber", "professors"],
            additionalProperties: false,
          },
        },
      },
      required: ["required", "fields", "sections"],
      additionalProperties: false,
      strict: true,
    },
    fetchProfessors: {
      type: "object",
      properties: {
        required: {
          type: "boolean",
          description:
            "Whether we need professor data from the 'professorRatings' collection.",
        },
        fields: {
          type: "array",
          description:
            "Specific fields to fetch from the 'professorRatings' collection.",
          items: {
            type: "string",
            enum: [
              "overallRating",
              "numEvals",
              "courseRating",
              "studentDifficulties",
              "tags",
              "reviews",
            ],
          },
        },
        sections: {
          type: "array",
          description: "Sections/professors for whom we need rating info.",
          items: {
            type: "object",
            properties: {
              courseId: {
                type: "string",
              },
              classNumber: {
                type: "number",
              },
              professors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                    },
                    name: {
                      type: "string",
                    },
                  },
                  required: ["id", "name"],
                  additionalProperties: false,
                },
              },
            },
            required: ["courseId", "classNumber", "professors"],
            additionalProperties: false,
          },
        },
      },
      required: ["required", "fields", "sections"],
      additionalProperties: false,
      strict: true,
    },
  },
  required: [
    "queryType",
    "fetchScheduleSections",
    "fetchAlternativeSections",
    "fetchProfessors",
  ],
  additionalProperties: false,
};
