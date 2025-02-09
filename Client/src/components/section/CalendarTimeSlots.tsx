import React from "react";

interface CalendarTimeSlotsProps {
  event: {
    extendedProps: {
      courseName: string;
      enrollmentStatus: "O" | "C";
      professor: string[];
      color: string;
    };
    title: string;
    start: Date;
    end: Date;
  };
}

const CalendarTimeSlots: React.FC<CalendarTimeSlotsProps> = ({ event }) => {
  const formattedStart = event.start.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const formattedEnd = event.end.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div
      className="rounded-md hover:opacity-90 transition-opacity"
      style={{ backgroundColor: event.extendedProps.color }}
    >
      <div className="flex flex-col">
        {/* Display the time range */}
        <div className="text-xs text-gray-700 dark:text-gray-700">
          {formattedStart} - {formattedEnd}
        </div>
        {/* Bold courseName */}
        <div className="text-sm font-bold text-gray-700 dark:text-gray-700 truncate">
          {event.extendedProps.courseName}
        </div>
        {/* Bold title (courseId) */}
        <div className="text-sm font-bold text-gray-700 dark:text-gray-700">
          {event.title}
        </div>
      </div>
    </div>
  );
};

export default CalendarTimeSlots;
