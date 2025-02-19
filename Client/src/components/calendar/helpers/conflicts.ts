import { SelectedSection } from "@polylink/shared/types";

/**
 * Converts a time string "HH:MM" to minutes since midnight.
 */
export function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr ? timeStr.split(":").map(Number) : [0, 0];
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

export default hasConflict;
