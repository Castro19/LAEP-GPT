import {
  GeneratedSchedule,
  SelectedSection,
  CourseTerm,
  ScheduleResponse,
} from "@polylink/shared/types";
import hasConflict from "./conflicts";
import { getConflictGroups } from "./weeklyCalendarConflicts";

/**
 * Transforms a Schedule into a GeneratedSchedule
 * @param schedule The Schedule to transform
 * @returns A GeneratedSchedule with the same sections and calculated properties
 */
export const scheduleToGeneratedSchedule = (
  schedule: ScheduleResponse
): GeneratedSchedule => {
  // Calculate if there are conflicts in the schedule
  const sections = schedule.sections;
  let withConflicts = false;
  let conflictGroups: SelectedSection[] = [];

  // Check for conflicts between sections
  for (let i = 0; i < sections.length; i++) {
    for (let j = i + 1; j < sections.length; j++) {
      if (hasConflict([sections[i]], [sections[j]])) {
        withConflicts = true;
        break;
      }
    }
    if (withConflicts) break;
  }

  // If there are conflicts, calculate conflict groups
  if (withConflicts) {
    // Convert SelectedSection to EventType for getConflictGroups
    const events = sections.map((section) => ({
      courseName: section.courseName,
      classNumber: section.classNumber.toString(),
      enrollmentStatus: section.enrollmentStatus,
      professors: section.professors,
      color: "",
      days: section.meetings.flatMap((m) => m.days),
      start_time: section.meetings[0]?.start_time || null,
      end_time: section.meetings[0]?.end_time || null,
    }));

    const groups = getConflictGroups(events);

    // Convert back to SelectedSection groups and flatten
    conflictGroups = groups.flatMap((group) =>
      group.map(
        (event) =>
          sections.find((s) => s.classNumber.toString() === event.classNumber)!
      )
    );
  }

  // Calculate average rating
  let ratingCount = 0;
  let professorWithRatingCount = 0;
  const seenCourses = new Set<string>();

  for (const section of sections) {
    if (!seenCourses.has(section.courseId)) {
      seenCourses.add(section.courseId);
      ratingCount += section.rating;

      if (section.rating > 0) {
        professorWithRatingCount++;
      }
    }
  }

  const averageRating =
    professorWithRatingCount > 0 ? ratingCount / professorWithRatingCount : 0;

  return {
    id: schedule.id,
    name: schedule.name,
    sections: schedule.sections,
    averageRating,
    withConflicts,
    conflictGroups,
  };
};

/**
 * Transforms a GeneratedSchedule into a Schedule
 * @param generatedSchedule The GeneratedSchedule to transform
 * @param name Optional name for the schedule
 * @returns A Schedule with the same sections and additional metadata
 */
export const generatedScheduleToSchedule = (
  generatedSchedule: GeneratedSchedule,
  name: string = "New Schedule",
  term: CourseTerm
): ScheduleResponse => {
  return {
    id: "", // This will be set by the backend
    name,
    term,
    sections: generatedSchedule.sections,
    customEvents: generatedSchedule.customEvents,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
