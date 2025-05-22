import { GeneratedSchedule, SelectedSection } from "@polylink/shared/types";
import { getConflictGroups } from "@/components/scheduleBuilder/helpers/weeklyCalendarConflicts";

export const computeScheduleConflicts = (sections: SelectedSection[]) => {
  // 1. Build one event per meeting-day
  const events = sections.flatMap((section) =>
    section.meetings.flatMap((meeting) => {
      if (!meeting.start_time || !meeting.end_time) return [];
      return meeting.days.map((day) => ({
        courseName: section.courseName,
        classNumber: section.classNumber,
        enrollmentStatus: section.enrollmentStatus,
        professors: section.professors,
        color: section.color,
        days: [day],
        start_time: meeting.start_time,
        end_time: meeting.end_time,
      }));
    })
  );

  // 2. Raw groups from the existing BFS
  const rawGroups = getConflictGroups(events);

  // 3. Collapse to unique-section groups and dedupe identical sets
  const seen = new Set<string>(); // "123-456" etc.
  const conflictGroups: SelectedSection[][] = [];

  for (const g of rawGroups) {
    // unique sections in this event-level group
    const uniqueIds = [...new Set(g.map((e) => e.classNumber))];

    if (uniqueIds.length < 2) continue; // a single section ≠ conflict

    const key = uniqueIds.sort().join("-"); // canonical signature
    if (seen.has(key)) continue; // already have this pair/set
    seen.add(key);

    conflictGroups.push(
      uniqueIds.map((id) => sections.find((s) => s.classNumber === id)!)
    );
  }

  return {
    conflictGroups,
    withConflicts: conflictGroups.length > 0,
  };
};

export const enrichWithConflicts = (
  sched: GeneratedSchedule
): GeneratedSchedule => {
  // don’t recompute if caller already supplied the data
  if (sched.conflictGroups) return sched;

  const { conflictGroups, withConflicts } = computeScheduleConflicts(
    sched.sections
  );
  return { ...sched, conflictGroups, withConflicts };
};
