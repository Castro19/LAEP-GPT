/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { SelectedSection } from "@polylink/shared/types";
import { ScheduleTimeSlots } from "@/components/scheduleBuilder";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchSingleSection } from "@/redux/classSearch/classSearchSlice";
import { useAppDispatch, useAppSelector } from "@/redux";
import {
  getConflictGroups,
  buildBackgroundEventsForGroup,
} from "@/components/scheduleBuilder/helpers/weeklyCalendarConflicts";
// import { environment } from "@/helpers/getEnvironmentVars";

type EventType = {
  courseName: string;
  classNumber: string;
  enrollmentStatus: "O" | "C" | "W";
  professors: Array<{ name: string; id: string | null }>;
  color: string;
  days: Array<"Mo" | "Tu" | "We" | "Th" | "Fr">;
  start_time: string | null;
  end_time: string | null;
};

export type ScheduleClassSection = {
  title: string;
  start: Date;
  end: Date;
  extendedProps: EventType;
};

type WeeklyScheduleProps = {
  sections: SelectedSection[];
  height?: string;
};

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({
  sections,
  height = "75vh",
}) => {
  const dispatch = useAppDispatch();
  const { currentScheduleTerm } = useAppSelector((state) => state.schedule);
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [calendarHeight, setCalendarHeight] = useState(height);
  const [containerHeight, setContainerHeight] = useState(0);

  // Update window height on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Measure container height
  useEffect(() => {
    if (containerRef.current) {
      const updateContainerHeight = () => {
        const height =
          containerRef.current?.getBoundingClientRect().height || 0;
        setContainerHeight(height);
      };

      updateContainerHeight();

      // Create a ResizeObserver to detect container size changes
      const resizeObserver = new ResizeObserver(updateContainerHeight);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  // Calculate calendar height based on window height and container
  useEffect(() => {
    // Define CSS custom properties for consistent spacing
    const root = document.documentElement;
    root.style.setProperty("--calendar-padding-top", "1rem");
    root.style.setProperty("--calendar-padding-bottom", "1rem");
    root.style.setProperty("--calendar-min-height", "350px");
    root.style.setProperty("--footer-height", "3rem"); // Reduced footer height
    root.style.setProperty("--footer-margin", "0.5rem"); // Reduced margin

    // Get the actual padding values from CSS
    const computedStyle = getComputedStyle(root);
    const paddingTop =
      parseFloat(computedStyle.getPropertyValue("--calendar-padding-top")) ||
      16;
    const paddingBottom =
      parseFloat(computedStyle.getPropertyValue("--calendar-padding-bottom")) ||
      16;
    const minHeight =
      parseFloat(computedStyle.getPropertyValue("--calendar-min-height")) ||
      350;
    const footerHeight =
      parseFloat(computedStyle.getPropertyValue("--footer-height")) || 48;
    const footerMargin =
      parseFloat(computedStyle.getPropertyValue("--footer-margin")) || 8;

    // Calculate total space needed for footer (height + margin)
    const totalFooterSpace = footerHeight + footerMargin;

    // Calculate available space, accounting for footer
    const availableHeight =
      windowHeight - paddingTop - paddingBottom - totalFooterSpace;

    // Device-specific adjustments based on measurements
    let heightPercentage = 0.75; // Default 75% (increased from 65%)

    // Adjust based on device width (for landscape vs portrait)
    const isLandscape = window.innerWidth > window.innerHeight;

    // Adjust based on device type and orientation
    if (window.innerWidth <= 768) {
      // Mobile devices
      heightPercentage = isLandscape ? 0.7 : 0.75;
    } else if (window.innerWidth <= 1024) {
      // Tablets
      heightPercentage = isLandscape ? 0.72 : 0.77;
    } else {
      // Desktop
      heightPercentage = isLandscape ? 0.73 : 0.75;
    }

    // For very small screens, use a more conservative approach
    if (windowHeight < 600) {
      heightPercentage = 0.65; // Increased from 0.55
    }

    // Calculate responsive height with precise measurements
    const baseHeight = windowHeight * heightPercentage;

    // Use container height if available, otherwise use calculated height
    let maxHeight = containerHeight > 0 ? containerHeight : availableHeight;

    // Ensure we don't exceed available height
    maxHeight = Math.min(maxHeight, availableHeight);

    // Calculate responsive height
    const calculatedHeight = Math.max(
      minHeight,
      Math.min(baseHeight, maxHeight)
    );

    // Convert to viewport height units for consistency
    const vhValue = Math.round((calculatedHeight / windowHeight) * 100);
    setCalendarHeight(`${vhValue}vh`);

    // if (environment === "dev") {
    //   console.log({
    //     windowHeight,
    //     availableHeight,
    //     calculatedHeight,
    //     vhValue,
    //     containerHeight,
    //     deviceType:
    //       window.innerWidth <= 768
    //         ? "mobile"
    //         : window.innerWidth <= 1024
    //           ? "tablet"
    //           : "desktop",
    //     orientation: isLandscape ? "landscape" : "portrait",
    //     heightPercentage,
    //     footerHeight,
    //     totalFooterSpace,
    //   });
    // }
  }, [windowHeight, containerHeight]);

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
          color: section.color,
          days: meeting.days,
          start_time: meeting.start_time,
          end_time: meeting.end_time,
        };
      });
    })
  );

  // 1) Split all normal events into conflict groups
  const groups = getConflictGroups(events as unknown as EventType[]);
  // 2) Build background events for each group (only if group size > 1? up to you)
  let backgroundEvents: any[] = [];
  for (const group of groups) {
    // If you only want to highlight if there's at least 2 events in a group:
    if (group.length > 1) {
      const bg = buildBackgroundEventsForGroup(group, monday);
      backgroundEvents = backgroundEvents.concat(bg);
    }
  }

  // 3) Combine
  const finalEvents = [...backgroundEvents, ...events];

  const handleEventClick = (eventClickArg: any) => {
    const { classNumber } = eventClickArg.event.extendedProps;
    dispatch(fetchSingleSection({ classNumber, term: currentScheduleTerm }));
  };

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
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
        overflow-hidden
        w-full
        h-full
        flex
        flex-col
        max-h-[calc(100vh-16rem)]
        sm:max-h-[calc(100vh-13rem)]
        md:max-h-[calc(100vh-10rem)]
        lg:max-h-[calc(100vh-8rem)]
      "
      >
        <ScrollArea className="h-full w-full">
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
            slotDuration="01:00:00"
            hiddenDays={[0, 6]}
            events={finalEvents}
            contentHeight={calendarHeight}
            expandRows={true}
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
              return (
                <ScheduleTimeSlots
                  event={arg.event as unknown as ScheduleClassSection}
                />
              );
            }}
            eventClick={handleEventClick}
            nowIndicator={false}
            eventDidMount={(info: any) => {
              // If this is a background event, style it on the fly
              if (info.event.display === "background") {
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

export default WeeklySchedule;
