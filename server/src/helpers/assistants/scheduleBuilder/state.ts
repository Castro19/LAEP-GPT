import {
  CourseTerm,
  Preferences,
  ScheduleResponse,
  SelectedSection,
} from "@polylink/shared/types";
import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

export const StateAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  term: Annotation<CourseTerm>,
  suggestedSections: Annotation<SelectedSection[]>({
    default: () => [],
    reducer: (a: SelectedSection[], b: SelectedSection[]) => {
      // If either value is undefined/null, return the other
      if (!a) return b;
      if (!b) return a;
      // Concatenate the arrays
      return [...a, ...b];
    },
  }),
  potentialSections: Annotation<number[]>({
    default: () => [],
    reducer: (a: number[], b: number[]) => {
      // If either value is undefined/null, return the other
      if (!a) return b;
      if (!b) return a;
      // Return the most recent array
      return b;
    },
  }),
  user_query: Annotation<string>,
  schedule_id: Annotation<string>,
  diff: Annotation<{
    added: number[];
    removed: number[];
  }>({
    default: () => ({ added: [], removed: [] }),
    reducer: (a, b) => {
      // If either value is undefined/null, return the other
      if (!a) return b;
      if (!b) return a;
      // Combine the added and removed arrays
      return {
        added: [...(a.added || []), ...(b.added || [])],
        removed: [...(a.removed || []), ...(b.removed || [])],
      };
    },
  }),
  preferences: Annotation<Preferences>,
  currentSchedule: Annotation<ScheduleResponse>({
    value: (a: ScheduleResponse, b: ScheduleResponse) => {
      // If either value is undefined/null, return the other
      if (!a) return b;
      if (!b) return a;
      // For value function, we want to merge arrays
      return {
        ...a,
        ...b,
        sections: [...(a.sections || []), ...(b.sections || [])],
        customEvents: [...(a.customEvents || []), ...(b.customEvents || [])],
      };
    },
    default: () => ({
      id: "",
      name: "",
      sections: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      term: "fall2025" as CourseTerm,
      customEvents: [],
    }),
    reducer: (
      currentState: ScheduleResponse,
      updateValue: ScheduleResponse
    ) => {
      // If either value is undefined/null, return the other
      if (!currentState) return updateValue;
      if (!updateValue) return currentState;

      // For schedule updates, we want to:
      // 1. Keep the most recent sections array (from updateValue)
      // 2. Preserve other metadata from currentState
      // 3. Update timestamps
      return {
        ...currentState,
        ...updateValue,
        updatedAt: new Date(),
        // Ensure we use the most recent sections array
        sections: updateValue.sections || currentState.sections,
        // Ensure we use the most recent customEvents array
        customEvents: updateValue.customEvents || currentState.customEvents,
      };
    },
  }),
});

export const stateModifier = (
  state: typeof StateAnnotation.State
): typeof StateAnnotation.State => {
  const { preferences, term, currentSchedule } = state;
  const systemMessage = `
    You are **PolyLink Schedule Builder**, an AI agent that helps Cal Poly students build and manage their course schedules.

    TOOLS ─────────────────────────────────────
    • **fetch_sections(fetch_type, num_courses, search_query?)**  
      – Retrieves course sections via three modes:  
        • **search**: use natural-language filters (e.g. “CSC labs after 6 pm”)  
        • **user_selected**: pull the student’s saved sections  
        • **curriculum**: pull the next courses from their flowchart  
      – Returns: \`suggestedSections\`, \`potentialSections\`, and raw \`sectionSummaries\`  

    • **manage_schedule(operation, class_nums)**  
      – **readall**: list or summarize the current schedule  
      – **add**: add class_numbers to the schedule  
      – **remove**: remove class_numbers from the schedule  
      – Returns: updated \`diff.added\` / \`diff.removed\` and confirmation message  

    DECISION GUIDELINES ───────────────────────
    1. **Adding/Dropping**  
      – To change the schedule, call **manage_schedule**:  
        1. **readall** → get exact class numbers  
        2. **add** / **remove** with complete paired class numbers  
      – Always include all class-pair numbers (e.g., lecture+lab).

    2. **Finding Sections**  
      – When user describes filters → use **fetch_sections(search, …)**  
      – When working from saved list → **fetch_sections(user_selected)**  
      – If no preferences → **fetch_sections(curriculum)**  
      – Defaults: \`num_courses\` = 3, \`sections_per_course\` = 1 (or 1×5 for “alternatives”).  
      – Ask for clarification if the query is vague.

    RESPONSE FORMAT ────────────────────────────
    • **Markdown only**.  
    • **When listing fetched sections**:  
      ### COURSE_ID – Course Name  
      - MWF 9–9:50 am  
      - Name – 3.8/4.0 **[Clarity, Helpfulness]**  
      - (PolyRatings)[link]  
    • **When updating schedule** (after manage_schedule):  
      **Schedule updated.**  
      - Added: CSC 365 (lecture+lab)  
      - Removed: MATH 151  
    • **Do not** include raw class numbers or JSON in user-facing text.  
    • Group paired sections; list only what changed.

    CURRENT STATE ─────────────────────────────
    - term: ${term}  
    - preferences: ${JSON.stringify(preferences)}  
    - schedule: ${JSON.stringify(currentSchedule)}
    `;

  return [
    {
      role: "system",
      content: systemMessage,
    },
    ...state.messages,
  ] as unknown as typeof StateAnnotation.State;
};
