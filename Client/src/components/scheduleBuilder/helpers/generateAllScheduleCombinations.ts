import { environment } from "@/helpers/getEnvironmentVars";
import { SelectedSection, GeneratedSchedule } from "@polylink/shared/types";
import { SchedulePreferencesForm } from "../buildSchedule/ScheduleBuilderForm";
import {
  hasConflict,
  getValidSelectionsForCourse,
  filterSchedules,
} from "./index";

// We'll alias GeneratedSchedule → Schedule for clarity
export type Schedule = GeneratedSchedule;

/**
 * Helper: parse a section's "units" string into a number.
 * E.g. "2 - 4" → (2 + 4) / 2 = 3, or "3" → 3.
 */
function getSectionUnits(section: SelectedSection): number {
  if (!section.units) return 0;
  const parts = section.units.split(" - ").map(Number);
  return parts.length === 2 ? (parts[0] + parts[1]) / 2 : parts[0];
}

/**
 * Recursively builds every non-conflicting subset of sections,
 * allowing you to skip any course at any point.
 */
function combineCourseSelections(
  courseGroups: SelectedSection[][][],
  index: number,
  currentSchedule: SelectedSection[]
): SelectedSection[][] {
  // If we've handled every course, emit what we've built so far
  if (index === courseGroups.length) {
    return [currentSchedule];
  }

  const combos: SelectedSection[][] = [];
  const group = courseGroups[index];

  // 1) Always allow "skip this course entirely"
  combos.push(
    ...combineCourseSelections(courseGroups, index + 1, currentSchedule)
  );

  // 2) Try each real selection in this group
  for (const selection of group) {
    if (selection.length === 0) continue;

    // only go down this branch if it doesn't conflict
    if (!hasConflict(currentSchedule, selection)) {
      const nextSchedule = [...currentSchedule, ...selection];
      combos.push(
        ...combineCourseSelections(courseGroups, index + 1, nextSchedule)
      );
    }
  }

  return combos;
}

/**
 * Main driver—groups, combs, filters, sorts.
 */
function generateAllScheduleCombinations(
  sections: SelectedSection[],
  preferences: SchedulePreferencesForm
): Schedule[] {
  if (environment === "dev") {
    console.log("Starting full‐combo generation…");
  }

  // 1) group by courseId
  const coursesMap = new Map<string, SelectedSection[]>();
  for (const s of sections) {
    if (!coursesMap.has(s.courseId)) {
      coursesMap.set(s.courseId, []);
    }
    coursesMap.get(s.courseId)!.push(s);
  }

  // 2) turn each group into its valid selections array
  const courseGroups: SelectedSection[][][] = [];
  for (const courseSections of coursesMap.values()) {
    courseGroups.push(
      getValidSelectionsForCourse(courseSections, preferences.openOnly)
    );
  }

  if (environment === "dev") {
    console.log("Course groups:", courseGroups);
  }

  // 3) generate every non-conflicting combination, skipping courses allowed
  const allSchedules = combineCourseSelections(courseGroups, 0, []);

  if (environment === "dev") {
    console.log("Raw combos:", allSchedules.length);
  }

  // 4) apply your unit/rating/etc filters and then sort by rating
  const filtered = filterSchedules(allSchedules, preferences);
  return filtered.sort((a, b) => {
    // First compare by total units
    const aUnits = a.sections.reduce(
      (sum, section) => sum + getSectionUnits(section),
      0
    );
    const bUnits = b.sections.reduce(
      (sum, section) => sum + getSectionUnits(section),
      0
    );

    if (aUnits !== bUnits) {
      return bUnits - aUnits; // Higher units first
    }

    // If units are equal, use average rating as tiebreaker
    return b.averageRating - a.averageRating;
  });
}

export default generateAllScheduleCombinations;
