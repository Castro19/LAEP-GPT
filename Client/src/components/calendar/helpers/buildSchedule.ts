import { SelectedSection } from "@polylink/shared/types";
// Define a type for a full weekly schedule.
export type Schedule = {
  sections: SelectedSection[]; // all sections chosen (note: a valid course selection may include one section or a pair)
  averageRating: number;
};

/**
 * Converts a time string "HH:MM" to minutes since midnight.
 */
function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Checks whether two meetings conflict.
 * Two meetings conflict if they occur on any common day and their time ranges overlap.
 */
function meetingsConflict(
  meetingA: {
    days: Array<"Mo" | "Tu" | "We" | "Th" | "Fr">;
    start_time: string | null;
    end_time: string | null;
  },
  meetingB: {
    days: Array<"Mo" | "Tu" | "We" | "Th" | "Fr">;
    start_time: string | null;
    end_time: string | null;
  }
): boolean {
  // If one of the meetings does not have times defined, we assume no conflict.
  if (
    !meetingA.start_time ||
    !meetingA.end_time ||
    !meetingB.start_time ||
    !meetingB.end_time
  ) {
    return false;
  }

  // Determine if the meetings share any common day.
  const commonDays = meetingA.days.filter((day) => meetingB.days.includes(day));
  if (commonDays.length === 0) {
    return false;
  }

  // Convert times to minutes
  const startA = parseTime(meetingA.start_time);
  const endA = parseTime(meetingA.end_time);
  const startB = parseTime(meetingB.start_time);
  const endB = parseTime(meetingB.end_time);

  // Two time intervals overlap if startA < endB and startB < endA.
  return startA < endB && startB < endA;
}

/**
 * Checks whether two sections conflict.
 * We check every meeting in section A against every meeting in section B.
 */
function sectionsConflict(
  secA: SelectedSection,
  secB: SelectedSection
): boolean {
  for (const meetingA of secA.meetings) {
    for (const meetingB of secB.meetings) {
      if (meetingsConflict(meetingA, meetingB)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Checks whether adding all sections in newSections to an existing set of sections causes a conflict.
 */
function hasConflict(
  existingSections: SelectedSection[],
  newSections: SelectedSection[]
): boolean {
  for (const sec1 of existingSections) {
    for (const sec2 of newSections) {
      if (sectionsConflict(sec1, sec2)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Returns true if the two sections are considered a valid pair.
 * That is, if one section’s classPair includes the other’s classNumber.
 */
function arePaired(
  sectionA: SelectedSection,
  sectionB: SelectedSection
): boolean {
  return (
    sectionA.classPair.includes(sectionB.classNumber) ||
    sectionB.classPair.includes(sectionA.classNumber)
  );
}

/**
 * Given all sections for a course (i.e. with the same courseId), return all valid selections.
 *
 * A valid selection is:
 * - A standalone section (if its classPair is empty) OR
 * - A pair of sections that are linked (i.e. one’s classPair includes the other’s classNumber).
 */
function getValidSelectionsForCourse(
  sections: SelectedSection[]
): SelectedSection[][] {
  const validSelections: SelectedSection[][] = [];

  // Add standalone sections (only if classPair is empty).
  sections.forEach((section) => {
    if (section.classPair.length === 0) {
      validSelections.push([section]);
    }
  });

  // Add valid pairs.
  for (let i = 0; i < sections.length; i++) {
    for (let j = i + 1; j < sections.length; j++) {
      const sectionA = sections[i];
      const sectionB = sections[j];
      if (arePaired(sectionA, sectionB)) {
        validSelections.push([sectionA, sectionB]);
      }
    }
  }

  return validSelections;
}

/**
 * Recursively combine course selections.
 *
 * @param courseSelections - an array where each element is an array of valid selections for a course.
 *                           (Each valid selection is itself an array of one or more SelectedSection.)
 * @param index - current index into courseSelections.
 * @param currentSchedule - the current built schedule.
 * @returns an array of complete schedules (each is an array of SelectedSection).
 */
function combineCourseSelections(
  courseSelections: SelectedSection[][][],
  index: number,
  currentSchedule: SelectedSection[]
): SelectedSection[][] {
  if (index === courseSelections.length) {
    // Base case: we have chosen one selection per course.
    return [currentSchedule];
  }

  const combinations: SelectedSection[][] = [];
  // For each valid selection option for the current course:
  for (const selection of courseSelections[index]) {
    // Check for any time conflict with the schedule built so far.
    if (!hasConflict(currentSchedule, selection)) {
      const newSchedule = currentSchedule.concat(selection);
      const subCombinations = combineCourseSelections(
        courseSelections,
        index + 1,
        newSchedule
      );
      combinations.push(...subCombinations);
    }
  }
  return combinations;
}

/**
 * Computes the average rating of a schedule.
 */
function computeAverageRating(sections: SelectedSection[]): number {
  const totalRating = sections.reduce((sum, sec) => sum + sec.rating, 0);
  return totalRating / sections.length;
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
export function generateSchedules(sections: SelectedSection[]): Schedule[] {
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
  const courseSelections: SelectedSection[][][] = [];
  for (const [, courseSections] of coursesMap.entries()) {
    const validSelections = getValidSelectionsForCourse(courseSections);
    // If no valid selection exists for a required course, then no complete schedule is possible.
    if (validSelections.length === 0) {
      return []; // Alternatively, you might want to throw an error or skip this course.
    }
    courseSelections.push(validSelections);
  }

  // Recursively combine one selection per course ensuring there are no time conflicts.
  const allScheduleSections = combineCourseSelections(courseSelections, 0, []);

  // Map each schedule combination to a Schedule object with average rating.
  const schedules: Schedule[] = allScheduleSections.map((scheduleSections) => ({
    sections: scheduleSections,
    averageRating: computeAverageRating(scheduleSections),
  }));

  // Sort schedules by descending average rating.
  schedules.sort((a, b) => b.averageRating - a.averageRating);

  return schedules;
}

/* Example Usage:
  
  import { generateSchedules, SelectedSection } from "./scheduleGenerator";
  
  const candidateSections: SelectedSection[] = [
    // ... populate with your sections ...
  ];
  
  const possibleSchedules = generateSchedules(candidateSections);
  console.log(possibleSchedules);
   
  */
