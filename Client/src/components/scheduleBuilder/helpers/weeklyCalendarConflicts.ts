/* eslint-disable @typescript-eslint/no-explicit-any */
import { parseTime } from "./conflicts";

type EventType = {
  courseName: string;
  classNumber: number;
  enrollmentStatus: "O" | "C" | "W";
  professors: Array<{ name: string; id: string | null }>;
  color: string;
  days: Array<"Mo" | "Tu" | "We" | "Th" | "Fr">;
  start_time: string | null;
  end_time: string | null;
};

function doEventsConflict(evA: EventType, evB: EventType): boolean {
  // Must have valid start/end time
  if (!evA.start_time || !evA.end_time || !evB.start_time || !evB.end_time) {
    return false;
  }

  // Check if they share any day of the week
  const commonDays = evA.days.filter((day) => evB.days.includes(day));
  if (commonDays.length === 0) {
    return false;
  }
  if (evA.classNumber === evB.classNumber) {
    return false;
  }
  // Compare times (in minutes from midnight)
  const startA = parseTime(evA.start_time);
  const endA = parseTime(evA.end_time);
  const startB = parseTime(evB.start_time);
  const endB = parseTime(evB.end_time);

  // Overlap check:
  // They conflict if (startA < endB) && (startB < endA)
  return startA < endB && startB < endA;
}

/**
 * Returns an array of "groups," where each group is an array of EventType
 * that all conflict with each other (directly or indirectly).
 */
function getConflictGroups(events: EventType[]): EventType[][] {
  const visited = new Set<number>();
  const groups: EventType[][] = [];

  for (let i = 0; i < events.length; i++) {
    if (visited.has(i)) continue;

    // Start a BFS queue for this new group
    const queue = [i];
    const group: EventType[] = [];

    while (queue.length > 0) {
      const currentIdx = queue.shift()!;
      if (!visited.has(currentIdx)) {
        visited.add(currentIdx);
        group.push(events[currentIdx]);

        // Check all other events for conflicts
        for (let j = 0; j < events.length; j++) {
          if (!visited.has(j)) {
            if (doEventsConflict(events[currentIdx], events[j])) {
              queue.push(j);
            }
          }
        }
      }
    }

    groups.push(group);
  }

  return groups;
}

/**
 * Suppose you already mapped Monday -> 0, Tuesday -> 1, etc.
 * and have a "monday" date object for the current week.
 * This function:
 *   - For each day in the group,
 *   - Gathers minStart & maxEnd (in minutes),
 *   - Produces a background event from that range
 */
function buildBackgroundEventsForGroup(
  group: EventType[],
  monday: Date
): any[] {
  const dayIndexMap: Record<"Mo" | "Tu" | "We" | "Th" | "Fr", number> = {
    Mo: 0,
    Tu: 1,
    We: 2,
    Th: 3,
    Fr: 4,
  };

  // For each day in the group, track the earliest + latest times across all events
  // We'll store in a map dayOffset => { minStart: number, maxEnd: number } in minutes
  const dayMap: Record<number, { minStart: number; maxEnd: number }> = {};

  for (const ev of group) {
    if (!ev.start_time || !ev.end_time) continue;

    const startMins = parseTime(ev.start_time);
    const endMins = parseTime(ev.end_time);

    // For each day code in ev.days, update the map
    for (const d of ev.days) {
      const offset = dayIndexMap[d];
      // Initialize if needed
      if (!dayMap[offset]) {
        dayMap[offset] = { minStart: startMins, maxEnd: endMins };
      } else {
        // Update
        if (startMins < dayMap[offset].minStart) {
          dayMap[offset].minStart = startMins;
        }
        if (endMins > dayMap[offset].maxEnd) {
          dayMap[offset].maxEnd = endMins;
        }
      }
    }
  }

  // Now build one background event per day in the dayMap
  const backgroundEvents: any[] = [];
  for (const [offsetStr, times] of Object.entries(dayMap)) {
    const offset = Number(offsetStr);

    // "baseDate" is Monday + offset days
    const baseDate = new Date(monday);
    baseDate.setDate(baseDate.getDate() + offset);

    // Build real start/end date objects
    const [startHour, startMinute] = [
      Math.floor(times.minStart / 60),
      times.minStart % 60,
    ];
    const [endHour, endMinute] = [
      Math.floor(times.maxEnd / 60),
      times.maxEnd % 60,
    ];

    const rangeStart = new Date(baseDate);
    rangeStart.setHours(startHour, startMinute, 0, 0);

    const rangeEnd = new Date(baseDate);
    rangeEnd.setHours(endHour, endMinute, 0, 0);

    backgroundEvents.push({
      start: rangeStart,
      end: rangeEnd,
      display: "background",
      color: "#DF6D6D", // make it darker red
    });
  }

  return backgroundEvents;
}

export { doEventsConflict, buildBackgroundEventsForGroup, getConflictGroups };
