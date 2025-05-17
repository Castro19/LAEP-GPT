// fetchSections.ts
import { tool } from "@langchain/core/tools";
import { ToolMessage } from "@langchain/core/messages";
import { z } from "zod";
import { CourseTerm, Section, SelectedSection } from "@polylink/shared/types";
import { StateAnnotation } from "./state";

// “Injected” helpers -------------------------------------------------
import {
  getSelectedSectionsTool,
  getUserNextEligibleSections,
  readAllSchedule,
  addToSchedule,
  removeFromSchedule,
  transformSectionToSelectedSection,
  findSectionsByFilter,
  getSectionsWithPairs,
} from "./helpers";
import {
  sectionQueryAssistant,
  SectionQueryResponse,
} from "../SectionQuery/sectionQueryAssistant";
import { Command, getCurrentTaskInput } from "@langchain/langgraph";
import { getScheduleById } from "../../../db/models/schedule/scheduleServices";
import { getSelectedSectionsByUserId } from "../../../db/models/selectedSection/selectedSectionServices";

export const fetchSections = tool(
  async (
    input: {
      fetch_type: "search" | "user_selected" | "curriculum";
      num_courses?: number;
      sections_per_course?: number;
      search_query?: string;
    },
    config
  ) => {
    const { fetch_type, num_courses, sections_per_course, search_query } =
      input;
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
    let sectionsToReturn: SelectedSection[] | Record<string, string> = [];

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
      sectionsToReturn = sections;
    } else if (fetch_type === "curriculum") {
      const sections = await getUserNextEligibleSections({
        userId: config.configurable.user_id,
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
      const selectedSections = await getSelectedSectionsByUserId(
        config.configurable.user_id,
        state.term as CourseTerm
      );
      sectionsToReturn = flatSecs.map(
        (s): SelectedSection =>
          transformSectionToSelectedSection(s, selectedSections)
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

    console.log("sectionsToReturn", sectionsToReturn);
    const sectionsWithPairs = await getSectionsWithPairs(
      sectionsToReturn as SelectedSection[],
      state.term as CourseTerm
    );
    sectionsToReturn = sectionsWithPairs as SelectedSection[];

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
        .default(5)
        .describe(
          "Number of courses to return (required for 'search' or 'curriculum')."
        ),
      sections_per_course: z
        .number()
        .int()
        .default(1)
        .describe("Max sections to return per course."),
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

    /* ---------- readall ---------- */
    if (operation === "readall") {
      const sections = await readAllSchedule(
        config.configurable.user_id,
        schedule_id
      );
      const updatedSchedule = await getScheduleById(
        config.configurable.user_id,
        schedule_id
      );
      return new Command({
        update: {
          messages: [
            new ToolMessage({
              content: sections.length
                ? JSON.stringify(sections)
                : "Your schedule is empty.",
              tool_call_id: config.toolCall.id,
            }),
          ],
          sections,
          currentSchedule: updatedSchedule,
        },
      });
    }

    /* ---------- add ---------- */
    if (operation === "add") {
      const { classNumbersAdded, messageToAdd, updatedSchedule } =
        await addToSchedule({
          userId: config.configurable.user_id,
          classNumbersToAdd: class_nums,
          scheduleId: schedule_id,
          preferences,
          selectedSections: state.sections,
        });

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
      // Get the current schedule state
      const currentSchedule = await getScheduleById(
        config.configurable.user_id,
        schedule_id
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

      // Process all removals in a single operation
      const { classNumbersRemoved, messageToAdd } = await removeFromSchedule({
        userId: config.configurable.user_id,
        classNumbersToRemove: class_nums,
        scheduleId: schedule_id,
      });

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
