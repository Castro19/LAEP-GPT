// fetchSections.ts
import { tool } from "@langchain/core/tools";
import { ToolMessage } from "@langchain/core/messages";
import { z } from "zod";
import { CourseTerm, Section, SectionEssential } from "@polylink/shared/types";
import { StateAnnotation } from "./state";

// “Injected” helpers -------------------------------------------------
import {
  getSelectedSectionsTool,
  getUserNextEligibleSections,
  readAllSchedule,
  addToSchedule,
  removeFromSchedule,
} from "./helpers";
import { findSectionsByFilter, QueryResponse } from "./sectionQueryAssistant";
import {
  sectionQueryAssistant,
  SectionQueryResponse,
} from "../SectionQuery/sectionQueryAssistant";
import { config } from "dotenv";
import { Command, getCurrentTaskInput } from "@langchain/langgraph";

export const fetchSections = tool(
  async (
    input: {
      fetch_type: "search" | "user_selected" | "curriculum";
      num_courses?: number;
      sections_per_course?: number;
      full_data: boolean;
      search_query?: string;
      state: typeof StateAnnotation.State;
    },
    config
  ) => {
    const {
      fetch_type,
      num_courses,
      sections_per_course,
      full_data,
      search_query,
    } = input;
    const state = getCurrentTaskInput() as typeof StateAnnotation.State;
    console.log(
      "======================STATE======================\n",
      JSON.stringify(state, null, 2)
    );

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
    if (
      ["search", "curriculum"].includes(fetch_type) &&
      (!num_courses || !sections_per_course)
    ) {
      return {
        update: {
          messages: [
            new ToolMessage({
              content:
                "num_courses and sections_per_course must be specified for search or curriculum fetch.",
              tool_call_id: config.toolCall.id,
            }),
          ],
        },
      };
    }

    /* ------------------ main branches ------------------ */
    let sectionsToReturn: SectionEssential[] | Record<string, string> = [];

    if (fetch_type === "user_selected") {
      const sections = await getSelectedSectionsTool({
        userId: state.user_id,
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
      sectionsToReturn = sections;
    } else if (fetch_type === "curriculum") {
      const sections = await getUserNextEligibleSections({
        userId: state.user_id,
        term: state.term,
        numCourses: num_courses!,
        sectionsPerCourse: sections_per_course!,
      });
      if (!sections.length) {
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
      sectionsToReturn = sections;
    } else if (fetch_type === "search") {
      console.log(
        "======================SEARCH QUERY======================\n",
        search_query
      );
      const resp: SectionQueryResponse = await sectionQueryAssistant(
        search_query!
      );
      console.log(
        "======================QUERY RESPONSE======================\n",
        JSON.stringify(resp, null, 2)
      );
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
        await findSectionsByFilter(resp.query, state.term as CourseTerm);
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
      const courseBuckets: Record<string, any[]> = {};
      for (const sec of mongoSections.sections) {
        const cid = sec.courseId;
        if (
          !(cid in courseBuckets) &&
          Object.keys(courseBuckets).length < num_courses!
        ) {
          courseBuckets[cid] = [sec];
        } else if (
          cid in courseBuckets &&
          courseBuckets[cid].length < sections_per_course!
        ) {
          courseBuckets[cid].push(sec);
        }
      }
      const flatSecs = Object.values(courseBuckets).flat();
      sectionsToReturn = flatSecs.map(
        (s): SectionEssential => ({
          classNumber: s.classNumber,
          courseId: s.courseId,
          courseName: s.courseName,
          units: s.units,
          instructors: s.instructors,
          instructorsWithRatings: s.instructorsWithRatings,
          classPair: s.classPair,
          meetings: s.meetings,
        })
      );
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

    /* ------------------ compact output if needed ------------------ */
    if (!full_data) {
      const compact: Record<string, string> = {};
      (sectionsToReturn as SectionEssential[]).forEach((s) => {
        compact[s.classNumber] = `${s.courseId}: ${s.courseName} ${s.meetings}`;
      });
      sectionsToReturn = compact;
    }

    /* ------------------ final payload ------------------ */
    return new Command({
      update: {
        messages: [
          new ToolMessage({
            content: `Fetched sections: ${JSON.stringify(sectionsToReturn)}`,
            tool_call_id: config.toolCall.id,
          }),
        ],
        sections: sectionsToReturn,
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
        .optional()
        .describe(
          "Number of courses to return (required for 'search' or 'curriculum')."
        ),
      sections_per_course: z
        .number()
        .int()
        .optional()
        .describe("Max sections to return per course."),
      full_data: z
        .boolean()
        .describe(
          "Return full section data when true; otherwise just class numbers / minimal info."
        ),
      search_query: z
        .string()
        .optional()
        .describe(
          "Search query (only when fetch_type='search'). Be as specific as possible."
        ),
      state: z
        .object({
          user_id: z.string(),
          term: z.string(),
        })
        .describe("Injected user/session state."),
    }),
  }
);

export const manageSchedule = tool(
  async (
    input: {
      operation: "readall" | "add" | "remove";
      class_nums?: number[];
      state: typeof StateAnnotation.State;
    },
    runCtx
  ) => {
    const { operation, class_nums = [] } = input;
    const callId = runCtx.toolCall?.id ?? "tool_call_id";

    const state = getCurrentTaskInput() as typeof StateAnnotation.State;
    console.log("state", state);
    /* ---------- validation ---------- */
    if (operation !== "readall" && class_nums.length === 0) {
      return new Command({
        update: {
          messages: [
            new ToolMessage({
              content:
                "You must provide class_nums when operation is 'add' or 'remove'.",
              tool_call_id: callId,
            }),
          ],
        },
      });
    }

    const { user_id, schedule_id, preferences } = state;

    /* ---------- readall ---------- */
    if (operation === "readall") {
      const sections = await readAllSchedule(user_id, schedule_id);
      return new Command({
        update: {
          messages: [
            new ToolMessage({
              content: sections.length
                ? JSON.stringify(sections)
                : "Your schedule is empty.",
              tool_call_id: callId,
            }),
          ],
          sections,
        },
      });
    }

    /* ---------- add ---------- */
    if (operation === "add") {
      const { sections, messageToAdd } = await addToSchedule({
        userId: user_id,
        classNumbersToAdd: class_nums,
        scheduleId: schedule_id,
        preferences,
      });

      return new Command({
        update: {
          messages: [
            new ToolMessage({
              content: messageToAdd || "No sections added.",
              tool_call_id: callId,
            }),
          ],
          sections,
        },
      });
    }

    /* ---------- remove ---------- */
    if (operation === "remove") {
      const { sections, messageToAdd } = await removeFromSchedule({
        userId: user_id,
        classNumbersToRemove: class_nums,
        scheduleId: schedule_id,
      });

      return new Command({
        update: {
          messages: [
            new ToolMessage({
              content: messageToAdd || "No sections removed.",
              tool_call_id: callId,
            }),
          ],
          sections,
        },
      });
    }

    /* ---------- fallback ---------- */
    return new Command({
      update: {
        messages: [
          new ToolMessage({
            content: "Invalid operation.",
            tool_call_id: callId,
          }),
        ],
      },
    });
  },
  {
    name: "manage_schedule",
    description:
      "Read, add, or remove course sections in a student's schedule.",
    schema: z.object({
      operation: z
        .enum(["readall", "add", "remove"])
        .describe("Operation to perform on the schedule."),
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
