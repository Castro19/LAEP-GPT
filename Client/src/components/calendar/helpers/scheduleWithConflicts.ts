import { environment } from "@/helpers/getEnvironmentVars";
import { SelectedSection } from "@polylink/shared/types";
import { CalendarPreferencesForm } from "../buildSchedule/CalendarBuilderForm";
import {
  getValidSelectionsForCourse,
  filterSchedules,
  Schedule,
} from "./index";

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

  for (const selection of currentCourseGroup) {
    // Skip empty selections
    if (selection.length === 0) continue;

    const newSchedule = [...currentSchedule, ...selection];
    const subCombinations = combineCourseSelections(
      courseGroups,
      index + 1,
      newSchedule
    );
    combinations.push(...subCombinations);
  }

  return combinations;
}

/**
 * Main function.
 *
 * Given an array of SelectedSection objects, generates all possible weekly schedules with:
 *  - No duplicate courseId entries unless they are part of a valid class pair.
 *
 * Each schedule includes its computed average rating. The final list is sorted by highest average rating.
 *
 * @param sections - The list of candidate sections.
 * @returns A sorted array of schedules.
 */
function generateScheduleWithConflicts(
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
    const validSelections = getValidSelectionsForCourse(
      courseSections,
      preferences.openOnly
    );
    courseGroups.push(validSelections);
  }

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

  const filteredSchedules = filterSchedules(allSchedules, preferences);

  return filteredSchedules;
}

export default generateScheduleWithConflicts;
