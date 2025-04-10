/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { SelectedSection } from "@polylink/shared/types";
import { CalendarTimeSlots } from "@/components/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchSingleSection } from "@/redux/classSearch/classSearchSlice";
import { useAppDispatch } from "@/redux";
import {
  getConflictGroups,
  buildBackgroundEventsForGroup,
} from "@/components/calendar/helpers/weeklyCalendarConflicts";
import { environment } from "@/helpers/getEnvironmentVars";

type EventType = {
  courseName: string;
  classNumber: string;
  enrollmentStatus: "O" | "C" | "W";
  professor: string[];
  color: string;
  days: Array<"Mo" | "Tu" | "We" | "Th" | "Fr">;
  start_time: string | null;
  end_time: string | null;
};

export type CalendarClassSection = {
  title: string;
  start: Date;
  end: Date;
  extendedProps: EventType;
};

// Define six pastel colors.
const courseColors = [
  "#E5FFB9", // light lime
  "#B9E5FF", // light blue
  "#B5E5B9", // light green
  "#FFB7A3", // light coral
  "#FFE5A3", // light yellow
  "#E5B9FF", // light purple
];

// Returns one of the colors based on the courseId string.
const getColorForCourse = (courseId: string): string => {
  let hash = 0;
  for (let i = 0; i < courseId.length; i++) {
    hash = courseId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % courseColors.length;
  return courseColors[index];
};

type WeeklyCalendarProps = {
  sections: SelectedSection[];
  height?: string;
};

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  sections,
  height = "80vh",
}) => {
  const dispatch = useAppDispatch();
  // Map meeting day abbreviations to an offset relative to Monday.
  // Monday: offset 0, Tuesday: 1, …, Sunday: 6.
  const dayIndexMap: Record<
    "Mo" | "Tu" | "We" | "Th" | "Fr" | "Sa" | "Su",
    number
  > = {
    Mo: 0,
    Tu: 1,
    We: 2,
    Th: 3,
    Fr: 4,
    Sa: 5,
    Su: 6,
  };

  // Compute Monday of the current week (in local time)
  const getCurrentWeekMonday = (): Date => {
    const now = new Date();
    // For Sunday (getDay() === 0), we want the Monday of the same week (6 days ago)
    const offset = (now.getDay() + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - offset);
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const monday = getCurrentWeekMonday();

  // Create an event for each meeting in every section.
  const events = sections.flatMap((section) =>
    section.meetings.flatMap((meeting) => {
      // Only create events if both start_time and end_time are provided.
      if (!meeting.start_time || !meeting.end_time) return [];
      return meeting.days.map((day) => {
        // Get the offset (in days) for this meeting day.
        const offset = dayIndexMap[day as keyof typeof dayIndexMap];
        const eventDate = new Date(monday);
        eventDate.setDate(monday.getDate() + offset);

        // Parse the start and end times (formatted as "HH:MM")
        const [startHour, startMinute] = meeting.start_time
          ? meeting.start_time.split(":").map(Number)
          : [0, 0];
        const [endHour, endMinute] = meeting.end_time
          ? meeting.end_time.split(":").map(Number)
          : [0, 0];

        // Create Date objects for the event start and end.
        const start = new Date(eventDate);
        start.setHours(startHour, startMinute, 0, 0);

        const end = new Date(eventDate);
        end.setHours(endHour, endMinute, 0, 0);

        return {
          title: section.courseId,
          courseName: section.courseName,
          classNumber: section.classNumber,
          enrollmentStatus: section.enrollmentStatus,
          professors: section.professors,
          start,
          end,
          color: getColorForCourse(section.courseId),
          days: meeting.days,
          start_time: meeting.start_time,
          end_time: meeting.end_time,
        };
      });
    })
  );

  // 1) Split all normal events into conflict groups
  const groups = getConflictGroups(events as unknown as EventType[]);
  console.log("Groups", groups);
  // 2) Build background events for each group (only if group size > 1? up to you)
  let backgroundEvents: any[] = [];
  for (const group of groups) {
    // If you only want to highlight if there's at least 2 events in a group:
    if (group.length > 1) {
      const bg = buildBackgroundEventsForGroup(group, monday);
      backgroundEvents = backgroundEvents.concat(bg);
    }
  }
  console.log("Background events", backgroundEvents);

  // 3) Combine
  const finalEvents = [...backgroundEvents, ...events];
  if (environment === "dev") {
    console.log("Final events", finalEvents);
  }
  const handleEventClick = (eventClickArg: any) => {
    const { classNumber } = eventClickArg.event.extendedProps;
    dispatch(fetchSingleSection(classNumber));
  };

  return (
    <div className="relative">
      {" "}
      {/* This container is now the modal's scope */}
      <div
        className="
        border
        border-slate-200
        dark:border-slate-700
        rounded-md
        bg-white
        dark:bg-slate-900
        text-slate-900
        dark:text-slate-100
        custom-tr-height
        custom-td-color
        overflow-auto flex-1 no-scroll
      "
      >
        <ScrollArea className="h-full min-w-full mb-4 pb-12">
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
            initialView="timeGridWeek"
            initialDate={monday}
            timeZone="local"
            headerToolbar={{ left: "", center: "", right: "" }}
            selectable={false}
            allDaySlot={false}
            slotMinTime="07:00:00"
            slotMaxTime="21:00:00"
            hiddenDays={[0, 6]}
            events={finalEvents}
            contentHeight={height}
            titleFormat={{}} // (Empty: no title text on top)
            dayHeaderContent={(args: any) => {
              const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
              return days[args.date.getDay()];
            }}
            dayHeaderClassNames="bg-gray-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 font-semibold text-center"
            slotLabelFormat={{
              hour: "numeric",
              minute: "2-digit",
              omitZeroMinute: false,
              meridiem: "short",
            }}
            slotLabelClassNames="text-gray-400 dark:text-slate-500 text-sm"
            dayCellClassNames="border border-slate-200 dark:border-slate-700"
            stickyHeaderDates={true}
            eventColor="#334155"
            eventClassNames={(arg: any) => {
              if (arg.event.extendedProps.isOverlay) {
                return ["conflict-overlay-event"];
              }
              return [];
            }}
            eventContent={(arg: any) => {
              if (arg.event.extendedProps.isOverlay) {
                return null; // no text
              }
              return CalendarTimeSlots({
                event: arg.event as unknown as CalendarClassSection,
              });
            }}
            eventClick={handleEventClick}
            nowIndicator={false}
            eventDidMount={(info: any) => {
              // If this is a background event, style it on the fly
              if (info.event.display === "background") {
                console.log("Background event", info.event);
                info.el.style.zIndex = "9999";
                info.el.style.pointerEvents = "none";
                info.el.style.backgroundColor = info.event.extendedProps.color;
              }
            }}
          />
        </ScrollArea>
      </div>
      <div id="calendar-modal-root" />
    </div>
  );
};

export default WeeklyCalendar;
