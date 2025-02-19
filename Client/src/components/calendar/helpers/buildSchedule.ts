import { environment } from "@/helpers/getEnvironmentVars";
import { SelectedSection } from "@polylink/shared/types";
import { CalendarPreferencesForm } from "../buildSchedule/CalendarBuilderForm";
import {
  hasConflict,
  getValidSelectionsForCourse,
  filterSchedules,
} from "./index";

// Define a type for a full weekly schedule.
export type Schedule = {
  sections: SelectedSection[]; // all sections chosen (note: a valid course selection may include one section or a pair)
  averageRating: number;
};

function combineCourseSelections(
  courseGroups: SelectedSection[][][],
  index: number,
  currentSchedule: SelectedSection[]
): SelectedSection[][] {
  if (index === courseGroups.length) {
    return [currentSchedule];
  }

  const combinations: SelectedSection[][] = [];
  const currentCourseGroup = courseGroups[index];
  let validSelectionFound = false;

  for (const selection of currentCourseGroup) {
    // Skip empty selections
    if (selection.length === 0) continue;

    if (!hasConflict(currentSchedule, selection)) {
      validSelectionFound = true;
      const newSchedule = [...currentSchedule, ...selection];
      const subCombinations = combineCourseSelections(
        courseGroups,
        index + 1,
        newSchedule
      );
      combinations.push(...subCombinations);
    }
  }

  // If no valid selection was found for this course group, then there’s no valid schedule.
  if (!validSelectionFound) {
    const subCombinations = combineCourseSelections(
      courseGroups,
      index + 1,
      currentSchedule
    );
    combinations.push(...subCombinations);
  }

  return combinations;
}

/**
 * Main function.
 *
 * Given an array of SelectedSection objects, generates all possible weekly schedules with:
 *  - No conflicting meeting times.
 *  - No duplicate courseId entries unless they are part of a valid class pair.
 *
 * Each schedule includes its computed average rating. The final list is sorted by highest average rating.
 *
 * @param sections - The list of candidate sections.
 * @returns A sorted array of schedules.
 */
export function generateAllScheduleCombinations(
  sections: SelectedSection[],
  preferences: CalendarPreferencesForm
): Schedule[] {
  // Group sections by courseId.
  const coursesMap = new Map<string, SelectedSection[]>();
  sections.forEach((section) => {
    if (!coursesMap.has(section.courseId)) {
      coursesMap.set(section.courseId, []);
    }
    coursesMap.get(section.courseId)!.push(section);
  });

  // For each course group, compute valid selection options.
  // Each element in courseSelections is an array of valid selections for one course.
  // A valid selection is itself an array of SelectedSection (either one section or a pair).
  const courseGroups: SelectedSection[][][] = [];
  for (const [, courseSections] of coursesMap.entries()) {
    const validSelections = getValidSelectionsForCourse(courseSections);
    // If no valid selection exists for a required course, then no complete schedule is possible.
    if (validSelections.length === 0) {
      return []; // Alternatively, you might want to throw an error or skip this course.
    }
    courseGroups.push(validSelections);
  }

  const isValid = courseGroups.every(
    (group) => group.length > 0 && group.every((sel) => sel.length > 0)
  );
  if (!isValid) return [];
  if (environment === "dev") {
    console.log("COURSE GROUPS", courseGroups);
  }
  const allSchedules: SelectedSection[][] = [];
  for (
    let courseGroupIndex = 0;
    courseGroupIndex < courseGroups.length;
    courseGroupIndex++
  ) {
    for (const selection of courseGroups[courseGroupIndex]) {
      // Start processing the next course group (courseGroupIndex + 1)
      const schedules = combineCourseSelections(
        courseGroups,
        courseGroupIndex + 1,
        selection
      );
      if (environment === "dev") {
        console.log(`SCHEDULES ${courseGroupIndex}: `, schedules);
      }
      allSchedules.push(...schedules);
    }
  }

  if (environment === "dev") {
    console.log("ALL SCHEDULES", allSchedules);
  }

  const filteredSchedules = filterSchedules(allSchedules, preferences);

  const schedules: Schedule[] = filteredSchedules.map((sections) => ({
    sections: sections.flat(),
    averageRating:
      sections.flat().reduce((sum, section) => sum + section.rating, 0) /
      sections.flat().length,
  }));

  return schedules;
}
