import { SelectedSection } from "@polylink/shared/types";
import { SchedulePreferencesForm } from "../buildSchedule/ScheduleBuilderForm";
import {
  getValidSelectionsForCourse,
  filterSchedules,
  Schedule,
} from "./index";

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
 * Recursively build schedules, carrying along unitCount.
 * Prune as soon as unitCount > maxUnits.
 * Only emit a completed schedule if unitCount >= minUnits.
 */
function combineWithUnitPruning(
  courseGroups: SelectedSection[][][],
  index: number,
  currentSchedule: SelectedSection[],
  unitCount: number,
  preferences: SchedulePreferencesForm
): SelectedSection[][] {
  const max = Number(preferences.maxUnits ?? Infinity);
  const min = Number(preferences.minUnits ?? 0);

  // leaf: we've considered every course
  if (index === courseGroups.length) {
    return unitCount >= min ? [currentSchedule] : [];
  }

  const combos: SelectedSection[][] = [];
  const group = courseGroups[index];

  // 1) SKIP this course entirely
  combos.push(
    ...combineWithUnitPruning(
      courseGroups,
      index + 1,
      currentSchedule,
      unitCount,
      preferences
    )
  );

  // 2) Try every real selection
  for (const selection of group) {
    if (selection.length === 0) continue;

    const selUnits = selection.map(getSectionUnits).reduce((a, b) => a + b, 0);

    // prune by maxUnits
    if (unitCount + selUnits > max) continue;

    combos.push(
      ...combineWithUnitPruning(
        courseGroups,
        index + 1,
        [...currentSchedule, ...selection],
        unitCount + selUnits,
        preferences
      )
    );
  }

  return combos;
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
  preferences: SchedulePreferencesForm
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
  const courseGroups: SelectedSection[][][] = [];
  for (const [, courseSections] of coursesMap.entries()) {
    const validSelections = getValidSelectionsForCourse(
      courseSections,
      preferences.openOnly
    );
    courseGroups.push(validSelections);
  }

  // Kick off recursion with 0 units so far
  const rawSchedules = combineWithUnitPruning(
    courseGroups,
    0,
    [],
    0,
    preferences
  );

  // Now just apply rating-based filters & sorting
  const rated = filterSchedules(rawSchedules, preferences);
  return rated.sort((a, b) => {
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

export default generateScheduleWithConflicts;
