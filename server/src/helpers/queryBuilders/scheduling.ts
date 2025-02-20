import { Calendar, Meeting } from "@polylink/shared/types";
// function buildQuery(sectionInfo: ScheduleBuilderSection[]) {
//   return sectionInfo.map((section) => section.courseId);
// }

// function findConflicts(sectionInfo: ScheduleBuilderSection[]) {
//   return sectionInfo.map((section) => section.courseId);
// }

/**
 * Minimal interface for a meeting relevant to time and days
 */

function findMeetingTimes(calendar: Calendar): Meeting[] {
  return calendar.sections.flatMap((section) => section.meetings) as Meeting[];
}
/**
 * Builds a MongoDB filter query to find Sections that have **no** conflicts
 * with the given userMeetings.
 *
 * A conflict is defined as any overlap in day(s) and time range.
 */
function buildNonConflictingQuery(
  primaryCalendar: Calendar
): Record<string, unknown> {
  console.log("primaryCalendar", primaryCalendar);
  const userMeetings = findMeetingTimes(primaryCalendar);
  console.log("userMeetings", userMeetings);
  // If the user has no meetings, don't filter anything out.
  if (!userMeetings || userMeetings.length === 0) {
    return {};
  }

  // For each of the user's meetings, construct the "conflict" condition.
  // We'll place them into a single `$or` array so that if **any** user meeting
  // conflicts, we consider that a conflict.
  const conflictConditions = userMeetings.map((m) => ({
    days: { $in: m.days }, // same day overlap
    start_time: { $lt: m.end_time }, // section starts before user's end
    end_time: { $gt: m.start_time }, // section ends after user's start
  }));

  // We then say: "exclude any sections where a 'meetings' entry matches
  // any of these conflict conditions."
  // => `$not: { $elemMatch: { $or: [ ...conflicts ] } }`
  // Also ensure 'meetings' exists and is non-empty (often helpful, but optional):
  return {
    meetings: {
      $exists: true,
      $ne: [],
      $not: {
        $elemMatch: {
          $or: conflictConditions,
        },
      },
    },
  };
}

export { buildNonConflictingQuery };
