import React from "react";
import { ScrollArea } from "../ui/scroll-area";

/**
 * A simple interface for each half-hour block's label status.
 */
type TimeBlock = {
  label: string; // e.g. "7:00 AM", "7:30 AM"
  isLabel: boolean; // true if it's on the hour (to display label)
};

const WeeklyCalendar: React.FC = () => {
  // Days displayed across the top (X-axis).
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Generate time blocks from 7:00 AM (7) to 9:00 PM (21), in 30-min increments
  const timeBlocks = generateTimes(7, 21, 30);

  return (
    <div
      className="
        relative
        max-h-[100vh]
        border
        border-slate-200
        dark:border-slate-700
        rounded-md
        bg-white
        dark:bg-slate-900
        text-slate-900
        dark:text-slate-100
        overflow-hidden
      "
    >
      {/* 
        1) Header Table: pinned at top.
           We separate out the <thead> into its own table so it won't scroll.
      */}
      <table className="table-fixed w-full border-collapse">
        <thead className="bg-gray-100 dark:bg-slate-800">
          <tr>
            {/* Time header cell */}
            <th
              className="
                border
                border-slate-200
                dark:border-slate-700
                p-2
                font-semibold
                text-center
              "
            >
              Time
            </th>
            {/* Monday - Friday */}
            {days.map((day) => (
              <th
                key={day}
                className="
                  border
                  border-slate-200
                  dark:border-slate-700
                  p-2
                  font-semibold
                  text-center
                "
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
      </table>
      <ScrollArea className="h-[85vh] w-full">
        <table className="table-fixed w-full border-collapse">
          {/* Table Body (Time Rows) */}
          <tbody>
            {timeBlocks.map((timeBlock, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                {/* Left Column: Time Labels (sticky) */}
                <td
                  className={`
                  sticky
                  left-0
                  z-10
                  border
                  border-slate-200
                  dark:border-slate-700
                  text-center
                  ${
                    timeBlock.isLabel
                      ? "bg-gray-50 dark:bg-slate-800 font-medium"
                      : "bg-gray-50 dark:bg-slate-800 text-sm text-gray-400 dark:text-slate-500"
                  }
                `}
                >
                  {/* Each row has a fixed height for spacing (h-16) */}
                  <div className="h-16 flex items-center justify-center">
                    {timeBlock.isLabel ? timeBlock.label : ""}
                  </div>
                </td>

                {/* Monday - Friday Cells */}
                {days.map((day) => (
                  <td
                    key={day}
                    className="
                    border
                    border-slate-200
                    dark:border-slate-700
                    relative
                  "
                  >
                    {/* Each cell also has the same fixed height for 30-min slot */}
                    <div className="h-16" />
                    {/* 
                    place events or selection inside here 
                  */}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  );
};

export default WeeklyCalendar;

/**
 * Generate half-hour times from `startHour` to `endHour` (7 -> 21).
 * We label only :00 blocks; :30 blocks remain unlabeled but present
 * so you can attach events there if needed.
 */
function generateTimes(
  startHour: number,
  endHour: number,
  stepMinutes: number
): TimeBlock[] {
  const times: TimeBlock[] = [];

  // 1) For each hour in [startHour, endHour)
  for (let hour = startHour; hour < endHour; hour++) {
    // 2) For each step in that hour
    for (let minute = 0; minute < 60; minute += stepMinutes) {
      const label = formatTime(hour, minute);
      const isLabel = minute === 0; // Only label on the hour
      times.push({ label, isLabel });
    }
  }

  // 3) Push the final hour label (9:00 PM)
  //    so that we see the last block labeled at 9:00 PM
  times.push({
    label: formatTime(endHour, 0),
    isLabel: true,
  });

  return times;
}

/**
 * Formats a given hour/minute in 12-hour clock notation with AM/PM.
 */
function formatTime(hour: number, minute: number): string {
  const meridiem = hour < 12 ? "AM" : "PM";
  // Convert to 12-hour
  let displayHour = hour % 12;
  displayHour = displayHour === 0 ? 12 : displayHour;

  const minuteStr = minute === 0 ? "00" : minute.toString().padStart(2, "0");
  return `${displayHour}:${minuteStr} ${meridiem}`;
}
