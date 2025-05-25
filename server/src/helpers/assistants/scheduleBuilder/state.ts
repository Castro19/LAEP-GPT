import {
  AcademicPlan,
  SectionBuckets,
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
  academicPlan: Annotation<AcademicPlan | null>({
    default: () => null,
    reducer: (_, b) => b ?? null, // always keep the newest summary
  }),
  sectionBuckets: Annotation<SectionBuckets | null>({
    default: () => null,
    reducer: (_, b) => b ?? null,
  }),
  planMeta: Annotation<{
    openTechNames: string[];
    openGECategories: string[];
    nextRequiredCount: number;
  } | null>({
    default: () => null,
    reducer: (_, b) => b ?? null,
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
  const { preferences, term, currentSchedule, user_query, academicPlan } =
    state;

  const planPreview = academicPlan
    ? `Required left: ${academicPlan.requiredCoursesLeft.length}; ` +
      `Tech-elec buckets left: ${academicPlan.techElectives.techElectives.length}; ` +
      `GE areas left: ${academicPlan.GEAreasLeft.map((a) => a.category).join(", ")}`
    : "Not loaded";

  const systemMessage = `
    You are **PolyLink Schedule Builder**, an AI agent that helps Cal Poly students build and manage their course schedules.

    FORMATTING ─────────────────────────────────────
    **Formatting rule for \`courseId\`:** Always supply the value as a single uppercase string with **no spaces** in the pattern \`AAAA999\`—that is, four capital letters identifying the subject followed immediately by a three-digit number (e.g., \`CSC101\`). Any other format is invalid.

    That gives readers:

    * the rule (“single uppercase string, no spaces”)
    * the exact pattern (\`AAAA999\`)
    * a concrete example (\`CSC101\`)
    * a clear warning that deviations aren't accepted

    TOOLS ─────────────────────────────────────
    • **fetch_sections(fetch_type, num_courses, search_query?)**  
      – Retrieves course sections via three modes:  
        • **search**: use natural-language filters (e.g. “CSC labs after 6 pm”)  
        • **alternate**: pull alternate sections for the given course IDs  (e.g. “CSC365”).
      – Returns: \`suggestedSections\`, \`potentialSections\`, and raw \`sectionSummaries\`  
    
    • **suggest_next_required_sections(requiredLimit?, techElective: {name, limit}, geArea: {name, limit})**
      – Chooses the next eligible **courseIds** from the academic plan  
      – pulls live sections for each ID and returns the same section arrays  
      – use after you already have an academic plan in memory

    • **manage_schedule(operation, class_nums)**  
      – **if (operation === "readall")**: list or summarize the current schedule  
      – **if (operation === "add")**: add class_numbers to the schedule  
      – **if (operation === "remove")**: remove class_numbers from the schedule  
      – Returns: updated \`diff.added\` / \`diff.removed\` and confirmation message  

    • **get_academic_plan_summary()**
      – Returns: a summary of the user's academic plan / flowchart
      - Use this tool to get the academic plan summary / flowchart when the user asks for it. Use if the student's schedule is empty and we need to get the academic plan summary to know what courses to add. 

    DECISION GUIDELINES ───────────────────────
    1. **Need degree progress?**  
      – Use **get_academic_plan_summary()** to get the academic plan summary / flowchart when the user asks for graduation progress.
      - Use if the student's schedule is empty and we need to get the academic plan summary to know what courses to add. 
      - If we are building the schedule use **suggest_next_eligible_sections()** to get the next eligible sections.
      - If you already have \`planMeta\`, you may infer the correct \`techElective\` or \`geArea\` arguments from the user's question; otherwise ask for clarification.

    2. **Recommend courses for next term**  
      – Call **suggest_next_required_sections** first (it internally picks required + tech-elec + GE).  
      – Then let the user approve, or call **manage_schedule(add)** yourself if they said "yes, add them".

    3. **Adding/Dropping**  
      – To change the schedule, call **manage_schedule**:  
        1. **if (operation === "readall")** → get exact class numbers  
        2. **if (operation === "add")** / **if (operation === "remove")** with complete paired class numbers  
      - When replacing with alternatives, remove then add the new sections.
      – Always include all class-pair numbers (e.g., lecture+lab).

    4. **Finding Sections**  
      – When user describes filters → use **fetch_sections(search, …)**  
      – When working from saved list → **fetch_sections(user_selected)**  
      – Defaults: \`num_courses\` = 3, \`sections_per_course\` = 1 (or 1×5 for "alternatives").  
      – Ask for clarification if the query is vague.

    RESPONSE FORMAT ────────────────────────────
    • **Markdown only**.  
    • **When listing fetched sections**:  
      ### COURSE_ID – Course Name  
      - MWF 9–9:50 am  
      - Name – 3.8/4.0 
      - **[Clarity, Helpfulness]**  
      - [PolyRatings](https://www.polyratings.com/course/CSC365)  
      - ClassNumber: 1234
    • **When updating schedule** (after manage_schedule):  
      **Schedule updated.**  
      - Added: CSC365 (lecture [classNumber] + lab [classPair])  
      - Removed: MATH 151 (lecture [classNumber] + lab [classPair])  
    • **Do not** include raw class numbers or JSON in user-facing text.  
    • Group paired sections; list only what changed.

    CURRENT STATE ─────────────────────────────
    - term: ${term}  
    - preferences: ${JSON.stringify(preferences)}  
    - schedule: ${JSON.stringify(currentSchedule)}
    - academic plan: ${planPreview}

    Answer the user's query in a concise manner.
    If the user's query is not clear, ask for clarification.
    If the user's query is not related to the schedule, or fetching sections, say so.
    User query: ${user_query.trim()}
    `;

  return [
    {
      role: "system",
      content: systemMessage,
    },
    ...state.messages,
  ] as unknown as typeof StateAnnotation.State;
};
