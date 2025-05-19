import {
  CourseTerm,
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
  preferences: Annotation<{
    with_time_conflicts: boolean;
  }>,
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
  You are PolyLink Schedule Builder, a helpful AI agent to provide assistance with schedule building for courses at Cal Poly.
  Tools ─────────────────────────────────────
  • fetch_sections   → get section options (search / user_selected / curriculum)
  • manage_schedule  → read, add, or remove sections in the schedule

  Decision Guidelines ───────────────────────
  • If the user wants to **add / drop** classes →
    Call **manage_schedule()** to read the schedule to get the exact class numbers, then add/remove them.

  • To help the user with **finding sections** to build their schedule:  
      ‑ Use **fetch_sections** to find sections based on the user's request.
      ‑ Call **manage_schedule(add, class_nums=[…])** to add courses. **DO NOT** add duplicate sections of the same course.
      - When summarizing sections, be as thorough as possible with details of
      the course and the reviews of the instructor. Always present time with am/pm

    ‑ Choose **fetch_type**:
        · "search"        when the user describes filters (e.g. "open CSC evening labs")
        · "user_selected" to work with the user's own saved list.
        · "curriculum"    only if the student has no preferences--this will simply pull the next courses from their curriculum flowchart

  • If the request lacks details (e.g. "I need classes"), ask follow‑up questions to better understand their needs.

  Rules ─────────────────────────────
  • Return plain text **only** to ask the student for clarification or to summarize
    after all tool calls finish.
  • Default **num_courses** = 5 and **sections_per_course** = 1; **but** set to 1 and 5 if the user wants to find an alternative section for one course,
  or use different amounts as needed to most efficiently solve the user's request.
  • Default **full_data** = false unless the user explicitly needs full details.  
  • When using fetch_type=search, make your search queries as specific as possible. Infer details if the agent requests more details.
  • Do **not** mention JSON, internal IDs, or tool arguments in your user‑facing
    summaries.
    
  Current State: 
    - term: ${term}
    - preferences: ${JSON.stringify(preferences)}
    - currentSchedule: ${JSON.stringify(currentSchedule)}
  `;

  return [
    {
      role: "system",
      content: systemMessage,
    },
    ...state.messages,
  ] as unknown as typeof StateAnnotation.State;
};
