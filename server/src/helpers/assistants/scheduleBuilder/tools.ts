// fetchSections.ts
import { tool } from "@langchain/core/tools";
import { ToolMessage } from "@langchain/core/messages";
import { z } from "zod";
import {
  CourseTerm,
  ScheduleResponse,
  Section,
  SelectedSection,
} from "@polylink/shared/types";
import { StateAnnotation } from "./state";

// “Injected” helpers -------------------------------------------------
import {
  getSelectedSectionsTool,
  getUserNextEligibleSections,
  readAllSchedule,
  addToSchedule,
  removeFromSchedule,
  findSectionsByFilter,
  getSectionsWithPairs,
  buildSectionSummaries,
} from "./helpers";
import {
  transformClassNumbersToSelectedSections,
  transformSectionToSelectedSection,
} from "../../../db/models/schedule/transformSection";
import {
  sectionQueryAssistant,
  SectionQueryResponse,
} from "../SectionQuery/sectionQueryAssistant";
import { Command, getCurrentTaskInput } from "@langchain/langgraph";
import { getScheduleById } from "../../../db/models/schedule/scheduleServices";
import { getSelectedSectionsByUserId } from "../../../db/models/selectedSection/selectedSectionServices";
import { environment } from "../../..";
import {
  POTENTIAL_SECTIONS_PER_COURSE,
  SUGGESTED_SECTIONS_PER_COURSE,
} from "./const";

export const fetchSections = tool(
  async (
    input: {
      fetch_type: "search" | "user_selected" | "curriculum";
      num_courses?: number;
      search_query?: string;
    },
    config
  ) => {
    const { fetch_type, num_courses, search_query } = input;
    const state = getCurrentTaskInput() as typeof StateAnnotation.State;

    // ---------- validation ----------
    if (search_query && fetch_type !== "search") {
      return new Command({
        update: {
          messages: [
            new ToolMessage({
              content: "Search query provided but fetch type is not 'search'.",
              tool_call_id: config.toolCall.id,
            }),
          ],
        },
      });
    }
    if (["search", "curriculum"].includes(fetch_type) && !num_courses) {
      return {
        update: {
          messages: [
            new ToolMessage({
              content:
                "num_courses must be specified for search or curriculum fetch.",
              tool_call_id: config.toolCall.id,
            }),
          ],
        },
      };
    }

    /* ------------------ main branches ------------------ */
    let sectionsToReturn: SelectedSection[] | Record<string, string> = [];
    let potentialSections: number[] = [];

    if (fetch_type === "user_selected") {
      const sections = await getSelectedSectionsTool({
        userId: config.configurable.user_id,
        term: state.term,
      });
      if (!sections.length) {
        return new Command({
          update: {
            messages: [
              new ToolMessage({
                content: "No selected sections found.",
                tool_call_id: config.toolCall.id,
              }),
            ],
          },
        });
      }
      potentialSections = sections.map((s) => s.classNumber);
      sectionsToReturn = sections;
    } else if (fetch_type === "curriculum") {
      const { potentialSectionsClassNums, suggestedSections } =
        await getUserNextEligibleSections({
          userId: config.configurable.user_id,
          term: state.term,
          numCourses: num_courses!,
        });

      if (!suggestedSections.length) {
        return new Command({
          update: {
            messages: [
              new ToolMessage({
                content: "No eligible sections found.",
                tool_call_id: config.toolCall.id,
              }),
            ],
          },
        });
      }

      sectionsToReturn = suggestedSections;
      potentialSections = potentialSectionsClassNums;
    } else if (fetch_type === "search") {
      if (environment === "dev") {
        console.log(
          "======================SEARCH QUERY======================\n",
          search_query
        );
      }
      const resp: SectionQueryResponse = await sectionQueryAssistant(
        search_query!
      );
      // if (environment === "dev") {
      //   console.log(
      //     "======================QUERY RESPONSE======================\n",
      //     JSON.stringify(resp, null, 2)
      //   );
      // }
      if (!resp || !resp.query) {
        return new Command({
          update: {
            messages: [
              new ToolMessage({
                content: `Search failed: ${resp?.explanation}`,
                tool_call_id: config.toolCall.id,
              }),
            ],
          },
        });
      }

      const mongoSections: { sections: Section[]; total: number } =
        await findSectionsByFilter(resp.query, state.term as CourseTerm, {
          "instructorsWithRatings.0.overallRating": -1,
        });
      if (!mongoSections?.sections?.length) {
        return new Command({
          update: {
            messages: [
              new ToolMessage({
                content: "No matching sections found.",
                tool_call_id: config.toolCall.id,
              }),
            ],
          },
        });
      }

      /* bucket → limit courses & sections per course */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const courseBuckets: Record<string, any[]> = {};
      const potentialBuckets: Record<string, any[]> = {};
      for (const sec of mongoSections.sections) {
        const cid = sec.courseId;
        // Handle potential sections (up to POTENTIAL_SECTIONS_PER_COURSE)
        if (
          !(cid in potentialBuckets) &&
          Object.keys(potentialBuckets).length < num_courses!
        ) {
          potentialBuckets[cid] = [sec];
        } else if (
          cid in potentialBuckets &&
          potentialBuckets[cid].length < POTENTIAL_SECTIONS_PER_COURSE
        ) {
          potentialBuckets[cid].push(sec);
        }

        // Handle suggested sections (up to SUGGESTED_SECTIONS_PER_COURSE)
        if (
          !(cid in courseBuckets) &&
          Object.keys(courseBuckets).length < num_courses!
        ) {
          courseBuckets[cid] = [sec];
        } else if (
          cid in courseBuckets &&
          courseBuckets[cid].length < SUGGESTED_SECTIONS_PER_COURSE
        ) {
          courseBuckets[cid].push(sec);
        }
      }
      const flatSecs = Object.values(courseBuckets).flat();
      const potentialSecs = Object.values(potentialBuckets).flat();
      const selectedSections = await getSelectedSectionsByUserId(
        config.configurable.user_id,
        state.term as CourseTerm
      );
      sectionsToReturn = flatSecs.map(
        (s): SelectedSection =>
          transformSectionToSelectedSection(
            s,
            selectedSections.find((s) => s.courseId === s.courseId)?.color
          )
      );
      potentialSections = potentialSecs.map((s) => s.classNumber);
    } else {
      return new Command({
        update: {
          messages: [
            new ToolMessage({
              content: "Invalid fetch type specified.",
              tool_call_id: config.toolCall.id,
            }),
          ],
        },
      });
    }
    // if (environment === "dev") {
    //   console.log("SECTIONS TO RETURN: ", sectionsToReturn);
    // }

    const sectionsWithPairs = await getSectionsWithPairs(
      sectionsToReturn as SelectedSection[],
      state.term as CourseTerm
    );
    sectionsToReturn = sectionsWithPairs as SelectedSection[];

    // Build section summaries to return
    const sectionSummaries = await buildSectionSummaries(sectionsToReturn);

    /* ------------------ final payload ------------------ */
    return new Command({
      update: {
        messages: [
          new ToolMessage({
            content: JSON.stringify({
              type: "sections_data",
              potentialSections,
              suggestedSections: sectionsToReturn,
              sectionSummaries: `use this content to summarize the sections fetched: ${sectionSummaries}`,
            }),
            tool_call_id: config.toolCall.id,
          }),
        ],
        potentialSections: potentialSections,
        suggestedSections: sectionsToReturn,
        sectionSummaries,
      },
    });
  },
  {
    name: "fetch_sections",
    description:
      "Search for course sections using natural-language filters, the user's curriculum, or their currently-selected classes.",
    schema: z.object({
      fetch_type: z
        .enum(["search", "user_selected", "curriculum"])
        .describe(
          "Whether to perform a search, pull the user's selected sections, or fetch the next curriculum-required course sections."
        ),
      num_courses: z
        .number()
        .int()
        .default(3)
        .describe(
          "Number of courses to return (required for 'search' or 'curriculum')."
        ),
      search_query: z
        .string()
        .optional()
        .describe(
          "Search query (only when fetch_type='search'). Be as specific as possible."
        ),
    }),
  }
);

export const manageSchedule = tool(
  async (
    input: {
      operation: "readall" | "add" | "remove";
      class_nums?: number[];
    },
    config
  ) => {
    const { operation, class_nums = [] } = input;

    const state = getCurrentTaskInput() as typeof StateAnnotation.State;
    /* ---------- validation ---------- */
    if (operation !== "readall" && class_nums.length === 0) {
      return new Command({
        update: {
          messages: [
            new ToolMessage({
              content:
                "You must provide class_nums when operation is 'add' or 'remove'.",
              tool_call_id: config.toolCall.id,
            }),
          ],
        },
      });
    }

    const { schedule_id, preferences } = state;

    const currentSchedule = await getScheduleById(
      config.configurable.user_id,
      schedule_id
    );

    /* ---------- readall ---------- */
    if (operation === "readall") {
      const sections = await readAllSchedule(
        config.configurable.user_id,
        schedule_id
      );

      return new Command({
        update: {
          messages: [
            new ToolMessage({
              content: sections.length
                ? (await buildSectionSummaries(sections)).join("\n\n")
                : "Your schedule is empty.",
              tool_call_id: config.toolCall.id,
            }),
          ],
          sections,
          currentSchedule,
        },
      });
    }

    /* ---------- add ---------- */
    if (operation === "add") {
      const { classNumbersAdded, messageToAdd } = await addToSchedule({
        userId: config.configurable.user_id,
        classNumbersToAdd: class_nums, // this is the class numbers to add the sections to the schedule
        scheduleId: schedule_id,
        preferences,
      });

      const newSelectedSections = await transformClassNumbersToSelectedSections(
        config.configurable.user_id,
        classNumbersAdded,
        state.term as CourseTerm
      );

      if (!currentSchedule) {
        return new Command({
          update: {
            messages: [
              new ToolMessage({
                content: "Schedule not found.",
                tool_call_id: config.toolCall.id,
              }),
            ],
          },
        });
      }

      const updatedSchedule: ScheduleResponse = {
        ...currentSchedule,
        sections: [
          ...(currentSchedule?.sections ?? []),
          ...newSelectedSections,
        ],
      };

      return new Command({
        update: {
          messages: [
            new ToolMessage({
              content: messageToAdd || "No sections added.",
              tool_call_id: config.toolCall.id,
            }),
          ],
          diff: {
            added: classNumbersAdded,
            removed: [],
          },
          currentSchedule: updatedSchedule,
        },
      });
    }

    /* ---------- remove ---------- */
    if (operation === "remove") {
      if (!currentSchedule) {
        return new Command({
          update: {
            messages: [
              new ToolMessage({
                content: "Schedule not found.",
                tool_call_id: config.toolCall.id,
              }),
            ],
          },
        });
      }

      // Process all removals in a single operation
      const { classNumbersRemoved, messageToAdd } = await removeFromSchedule({
        userId: config.configurable.user_id,
        classNumbersToRemove: class_nums,
        scheduleId: schedule_id,
      });

      const updatedSchedule = {
        ...currentSchedule,
        sections: currentSchedule.sections.filter(
          (s) => !classNumbersRemoved.includes(s.classNumber)
        ),
      };
      return new Command({
        update: {
          messages: [
            new ToolMessage({
              content: messageToAdd || "No sections removed.",
              tool_call_id: config.toolCall.id,
            }),
          ],
          diff: {
            added: [],
            removed: classNumbersRemoved,
          },
          currentSchedule: updatedSchedule,
        },
      });
    }

    /* ---------- fallback ---------- */
    return new Command({
      update: {
        messages: [
          new ToolMessage({
            content: "Invalid operation.",
            tool_call_id: config.toolCall.id,
          }),
        ],
      },
    });
  },
  {
    name: "manage_schedule",
    description:
      "Read (summarize, list, provide details), add, or remove course sections in a student's schedule.",
    schema: z.object({
      operation: z
        .enum(["readall", "add", "remove"])
        .describe(
          "Operation to perform on the schedule. Use readall to summarize, list, or provide details about the schedule."
        ),
      class_nums: z
        .array(z.number())
        .optional()
        .describe(
          "List of class numbers to add or remove (ignored for 'readall')."
        ),
      state: z
        .object({
          user_id: z.string(),
          schedule_id: z.string(),
          term: z.string(),
          preferences: z.record(z.any()).optional(),
        })
        .describe("Injected user/session state."),
    }),
  }
);
