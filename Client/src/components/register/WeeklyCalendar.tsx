import { Fragment, useState } from "react";
import { useUserData } from "@/hooks/useUserData";
import { useAppSelector } from "@/redux";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Time slots from 8 AM to 8 PM in 1-hour intervals
const timeSlots = Array.from({ length: 13 }, (_, i) => 8 + i); // [8, 9, ..., 20]

// Helper functions to add or remove an hour from intervals
const removeHourFromIntervals = (
  intervals: [number, number][],
  hour: number
): [number, number][] => {
  const newIntervals: [number, number][] = [];

  for (const [start, end] of intervals) {
    if (hour < start || hour > end) {
      // This interval does not include the hour
      newIntervals.push([start, end]);
    } else {
      // This interval includes the hour
      if (start === end && start === hour) {
        // Remove this interval entirely
        continue;
      } else if (start === hour) {
        // Move start up by one
        newIntervals.push([start + 1, end]);
      } else if (end === hour) {
        // Move end down by one
        newIntervals.push([start, end - 1]);
      } else {
        // Split the interval
        newIntervals.push([start, hour - 1]);
        newIntervals.push([hour + 1, end]);
      }
    }
  }

  return newIntervals;
};

const addHourToIntervals = (
  intervals: [number, number][],
  hour: number
): [number, number][] => {
  // Add the new hour as an interval
  const newIntervals = [...intervals, [hour, hour]];
  // Sort intervals
  newIntervals.sort((a, b) => a[0] - b[0]);
  // Merge overlapping or adjacent intervals
  const mergedIntervals: [number, number][] = [];

  for (const [currentStart, currentEnd] of newIntervals) {
    if (mergedIntervals.length === 0) {
      mergedIntervals.push([currentStart, currentEnd]);
    } else {
      const [, lastEnd] = mergedIntervals[mergedIntervals.length - 1];
      if (currentStart <= lastEnd + 1) {
        // Merge intervals
        mergedIntervals[mergedIntervals.length - 1][1] = Math.max(
          lastEnd,
          currentEnd
        );
      } else {
        mergedIntervals.push([currentStart, currentEnd]);
      }
    }
  }

  return mergedIntervals;
};

// Helper function to format time in AM/PM
const formatTime = (hour: number) => {
  const period = hour >= 12 ? "PM" : "AM";
  const standardHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${standardHour} ${period}`;
};

const TimeSlot = ({
  day,
  hour,
  isAvailable,
  handleMouseDown,
  handleMouseEnter,
  inReadMode,
}: {
  day: string;
  hour: number;
  isAvailable: boolean;
  // eslint-disable-next-line no-unused-vars
  handleMouseDown: (day: string, hour: number) => void;
  // eslint-disable-next-line no-unused-vars
  handleMouseEnter: (day: string, hour: number) => void;
  inReadMode: boolean;
}) => (
  <div
    className={`w-12 h-8 m-0.5 text-xs flex items-center justify-center border select-none ${
      isAvailable ? "bg-green-800" : "bg-gray-800"
    } ${inReadMode ? "" : "cursor-pointer"}`}
    onMouseDown={() => !inReadMode && handleMouseDown(day, hour)}
    onMouseEnter={() => !inReadMode && handleMouseEnter(day, hour)}
  >
    {formatTime(hour)}
  </div>
);

const WeeklyCalendar = ({ inReadMode = false }: { inReadMode?: boolean }) => {
  const [isDragging, setIsDragging] = useState(false);
  const { handleChange } = useUserData();
  const userData = useAppSelector((state) => state.user.userData);
  const [draggingToSelect, setDraggingToSelect] = useState<boolean | null>(
    null
  );
  const availability = userData?.availability || {};

  const handleTimeSlotMouseDown = (day: string, hour: number) => {
    const dayIntervals = availability[day] || [];
    const isAvailable = dayIntervals.some(
      ([start, end]) => hour >= start && hour <= end
    );

    // Set dragging state
    setIsDragging(true);
    setDraggingToSelect(!isAvailable); // If currently available, we will deselect; else select

    // Update availability
    updateAvailability(day, hour, !isAvailable);
  };

  const handleTimeSlotMouseEnter = (day: string, hour: number) => {
    if (!isDragging || draggingToSelect === null) return;

    // Update availability
    updateAvailability(day, hour, draggingToSelect);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggingToSelect(null);
  };

  const updateAvailability = (
    day: string,
    hour: number,
    shouldSelect: boolean
  ) => {
    const dayIntervals = availability[day] || [];
    let newDayIntervals: [number, number][];

    if (shouldSelect) {
      // Add the hour
      newDayIntervals = addHourToIntervals(dayIntervals, hour);
    } else {
      // Remove the hour
      newDayIntervals = removeHourFromIntervals(dayIntervals, hour);
    }

    // Create a new availability object
    const newAvailability = {
      ...availability,
      [day]: newDayIntervals,
    };

    // Call handleAvailabilityChange with the new availability
    handleChange("availability", newAvailability);
  };

  return (
    <div
      className="flex flex-col justify-center align-center"
      onMouseLeave={handleMouseUp} // In case the mouse leaves the calendar while dragging
      onMouseUp={handleMouseUp} // Ensure dragging stops when mouse is released
    >
      {daysOfWeek.map((day) => {
        const displayDay = inReadMode && availability[day]?.length === 0;

        return (
          <Fragment key={day}>
            {!displayDay && (
              <div
                key={day}
                className="flex flex-col justify-center align-center flex-wrap p-4"
              >
                <h3 className="text-base mb-2 dark:text-white">{day}</h3>
                <div className="flex justify-center align-center flex-wrap">
                  {timeSlots.map((hour) => {
                    const isAvailable = availability[day]?.some(
                      ([start, end]) => hour >= start && hour <= end
                    );
                    return (
                      <TimeSlot
                        key={hour}
                        day={day}
                        hour={hour}
                        isAvailable={isAvailable}
                        handleMouseDown={handleTimeSlotMouseDown}
                        handleMouseEnter={handleTimeSlotMouseEnter}
                        inReadMode={inReadMode}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

export default WeeklyCalendar;
