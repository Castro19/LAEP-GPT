/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  useAppDispatch,
  useAppSelector,
  classSearchActions,
  scheduleActions,
} from "@/redux";
import { CustomScheduleEvent } from "@polylink/shared/types";

// My components
import { ScheduleTimeSlots } from "@/components/scheduleBuilder";
// UI Components
import { ScrollArea } from "@/components/ui/scroll-area";

// Helpers
import {
  getConflictGroups,
  buildBackgroundEventsForGroup,
} from "@/components/scheduleBuilder";
// Types
import { SelectedSection } from "@polylink/shared/types";
import AsyncCourses from "./AsyncCourses";
import CustomEventSlot from "./CustomEventSlot";
import { Modal } from "@/components/ui/animated-modal";

type EventType = {
  courseName: string;
  classNumber: number;
  enrollmentStatus: "O" | "C" | "W";
  professors: Array<{ name: string; id: string | null }>;
  color: string;
  days: Array<"Mo" | "Tu" | "We" | "Th" | "Fr">;
  start_time: string | null;
  end_time: string | null;
  isAsynchronous?: boolean;
  isCustomEvent: boolean;
};
export type ScheduleClassSection = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  extendedProps: EventType;
};

type WeeklyScheduleProps = {
  sections: SelectedSection[];
  height: string;
  isProfilePage?: boolean;
};

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({
  sections,
  height,
  isProfilePage = false,
}) => {
  const dispatch = useAppDispatch();
  const { currentScheduleTerm, hiddenSections } = useAppSelector(
    (s) => s.schedule
  );

  // --- layout state & measurements (unchanged) ---
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [calendarHeight, setCalendarHeight] = useState(height);
  const [containerHeight, setContainerHeight] = useState(0);
  const [asyncCoursesHeight, setAsyncCoursesHeight] = useState(0);

  useEffect(() => {
    const onResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const measure = () =>
      setContainerHeight(
        containerRef.current!.getBoundingClientRect().height || 0
      );
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (isProfilePage) return;
    const root = document.documentElement;
    root.style.setProperty("--calendar-padding-top", "1rem");
    root.style.setProperty("--calendar-padding-bottom", "1rem");
    root.style.setProperty("--calendar-min-height", "350px");
    root.style.setProperty("--footer-height", "3rem");
    root.style.setProperty("--footer-margin", "0.5rem");

    const cs = getComputedStyle(root);
    const pt = parseFloat(cs.getPropertyValue("--calendar-padding-top")) || 16;
    const pb =
      parseFloat(cs.getPropertyValue("--calendar-padding-bottom")) || 16;
    const minH =
      parseFloat(cs.getPropertyValue("--calendar-min-height")) || 350;
    const fh = parseFloat(cs.getPropertyValue("--footer-height")) || 48;
    const fm = parseFloat(cs.getPropertyValue("--footer-margin")) || 8;
    const totalFooter = fh + fm;

    const available = windowHeight - pt - pb - totalFooter - asyncCoursesHeight;

    let pct = 0.75;
    const isLandscape = window.innerWidth > window.innerHeight;
    if (window.innerWidth <= 768) pct = isLandscape ? 0.7 : 0.65;
    else if (window.innerWidth <= 1024) pct = isLandscape ? 0.72 : 0.77;
    else pct = isLandscape ? 0.73 : 0.75;
    if (windowHeight < 600) pct = 0.65;
    if (isProfilePage) pct = 1;

    const base = windowHeight * pct;
    let maxH = containerHeight > 0 ? containerHeight : available;
    maxH = Math.min(maxH, available);
    const calc = Math.max(minH, Math.min(base, maxH));

    const vh = Math.round((calc / windowHeight) * 100);
    const asyncPct = asyncCoursesHeight / windowHeight;
    const adjusted = Math.max(
      vh - Math.round(asyncPct * 100),
      Math.round((minH / windowHeight) * 100)
    );

    setCalendarHeight(`${adjusted}vh`);
  }, [windowHeight, containerHeight, asyncCoursesHeight, isProfilePage]);

  const handleAsyncCoursesHeightChange = useCallback(
    (h: number) => setAsyncCoursesHeight(h),
    []
  );

  // --- week start (stable) ---
  const monday = useMemo(() => {
    const now = new Date();
    const offset = (now.getDay() + 6) % 7;
    const m = new Date(now);
    m.setDate(now.getDate() - offset);
    m.setHours(0, 0, 0, 0);
    return m;
  }, []);

  // --- map day abbrev to offset ---
  const dayIndexMap: Record<string, number> = {
    Mo: 0,
    Tu: 1,
    We: 2,
    Th: 3,
    Fr: 4,
    Sa: 5,
    Su: 6,
  };

  // --- build your regular events once per sections/monday ---
  const memoizedEvents = useMemo<ScheduleClassSection[]>(() => {
    return sections.flatMap((section) => {
      const isAsync =
        section.meetings.length === 0 ||
        section.meetings.every((m) => !m.start_time || !m.end_time);
      if (isAsync) return [];

      return section.meetings.flatMap((meeting) => {
        if (!meeting.start_time || !meeting.end_time) return [];
        return meeting.days.map((day) => {
          const offset = dayIndexMap[day];
          const date = new Date(monday);
          date.setDate(monday.getDate() + offset);

          const [sh, sm] = meeting.start_time?.split(":").map(Number) || [0, 0];
          const [eh, em] = meeting.end_time?.split(":").map(Number) || [0, 0];

          const start = new Date(date);
          start.setHours(sh, sm, 0, 0);
          const end = new Date(date);
          end.setHours(eh, em, 0, 0);

          const id = `${section.classNumber}-${day}-${meeting.start_time}-${meeting.end_time}`;
          return {
            id,
            title: section.courseId,
            start,
            end,
            extendedProps: {
              courseName: section.courseName,
              classNumber: section.classNumber,
              enrollmentStatus: section.enrollmentStatus,
              professors: section.professors,
              color: section.color,
              days: meeting.days,
              start_time: meeting.start_time,
              end_time: meeting.end_time,
              isAsynchronous: false,
              isCustomEvent: false,
            },
          };
        });
      });
    });
  }, [sections, monday]);

  // --- background conflict events ---
  const memoizedBackgroundEvents = useMemo(() => {
    const groups = getConflictGroups(
      memoizedEvents.map((e) => ({
        ...e.extendedProps,
        start: e.start,
        end: e.end,
      }))
    );
    return groups
      .filter((g) => g.length > 1)
      .flatMap((g) => buildBackgroundEventsForGroup(g, monday));
  }, [memoizedEvents, monday]);

  // --- custom events from Redux ---
  const customEvents = useAppSelector(
    (s) => s.schedule.currentSchedule?.customEvents || []
  );
  const calendarCustomEvents = useMemo(() => {
    return customEvents.flatMap((evt) => {
      // For each day in the meeting, create a separate event
      return evt.meetings[0].days.map((day) => {
        const offset = dayIndexMap[day];
        const date = new Date(monday);
        date.setDate(monday.getDate() + offset);

        const [sh, sm] = evt.meetings[0].start_time?.split(":").map(Number) || [
          0, 0,
        ];
        const [eh, em] = evt.meetings[0].end_time?.split(":").map(Number) || [
          0, 0,
        ];
        const start = new Date(date);
        start.setHours(sh, sm, 0, 0);
        const end = new Date(date);
        end.setHours(eh, em, 0, 0);

        return {
          id: `${evt.id}-${day}`,
          title: evt.title,
          start,
          end,
          color: evt.color,
          extendedProps: {
            isCustomEvent: true,
            ...evt,
            // Include the specific day in the extendedProps
            currentDay: day,
          },
        };
      });
    });
  }, [customEvents, monday]);

  // --- combine & filter hidden ---
  const filteredEvents = useMemo(
    () =>
      [...memoizedBackgroundEvents, ...memoizedEvents].filter(
        (e) =>
          !e.extendedProps?.classNumber ||
          !hiddenSections.includes(e.extendedProps.classNumber)
      ),
    [memoizedBackgroundEvents, memoizedEvents, hiddenSections]
  );
  const allEvents = useMemo(
    () => [...filteredEvents, ...calendarCustomEvents],
    [filteredEvents, calendarCustomEvents]
  );

  // --- interaction callbacks ---
  const handleEventClick = useCallback(
    (arg: any) => {
      const { classNumber } = arg.event.extendedProps;
      dispatch(
        classSearchActions.fetchSingleSection({
          classNumber,
          term: currentScheduleTerm,
        })
      );
    },
    [dispatch, currentScheduleTerm]
  );

  const handleSelect = useCallback(
    (selectInfo: any) => {
      const dow = selectInfo.start.getDay();
      if (dow === 0 || dow === 6) return;
      const dayMap: Record<number, string> = {
        1: "Mo",
        2: "Tu",
        3: "We",
        4: "Th",
        5: "Fr",
      };
      const fmt = (d: Date) =>
        `${d.getHours().toString().padStart(2, "0")}:${d
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
      const tempId = `TEMP-${Date.now()}`;
      const newEvt: CustomScheduleEvent = {
        id: tempId,
        title: "New Event",
        color: "#334155",
        meetings: [
          {
            days: [dayMap[dow] as "Mo" | "Tu" | "We" | "Th" | "Fr"],
            start_time: fmt(selectInfo.start),
            end_time: fmt(selectInfo.end),
          },
        ],
        isVisible: true,
        isLocked: false,
      };
      dispatch(scheduleActions.upsertCustomEvent(newEvt));
    },
    [dispatch]
  );

  const handleEyeClick = useCallback(
    (arg: any) => {
      const cn = arg.event.extendedProps.classNumber;
      dispatch(scheduleActions.toggleHiddenSection(cn));
    },
    [dispatch]
  );

  // --- FullCalendar callbacks & options, all stable refs ---
  const plugins = useMemo(
    () => [timeGridPlugin, interactionPlugin, dayGridPlugin],
    []
  );
  const headerToolbar = useMemo(
    () => ({ left: "", center: "", right: "" }),
    []
  );
  const titleFormat = useMemo(() => ({}), []);
  const slotLabelFormat = useMemo(
    () => ({
      hour: "numeric",
      minute: "2-digit",
      omitZeroMinute: false,
      meridiem: "short",
    }),
    []
  );
  const dayHeaderContent = useCallback((args: any) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[args.date.getDay()];
  }, []);
  const dayHeaderClassNames = useMemo(
    () =>
      "bg-gray-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 font-semibold text-center",
    []
  );
  const slotLabelClassNames = useMemo(
    () => "text-gray-400 dark:text-slate-500 text-sm",
    []
  );
  const dayCellClassNames = useMemo(
    () => "border border-slate-200 dark:border-slate-700",
    []
  );
  const eventClassNamesCb = useCallback((arg: any) => {
    if (arg.event.extendedProps.isOverlay) return ["conflict-overlay-event"];
    if (arg.event.extendedProps.isCustomEvent) return ["custom-event"];
    return [];
  }, []);
  const eventContentCb = useCallback(
    (arg: any) => {
      if (arg.event.extendedProps.isOverlay) return null;
      if (arg.event.extendedProps.isCustomEvent) {
        return (
          <Modal>
            <CustomEventSlot
              event={arg.event.extendedProps as CustomScheduleEvent}
            />
          </Modal>
        );
      } else {
        return (
          <ScheduleTimeSlots
            event={arg.event as any}
            onClick={() => handleEventClick(arg)}
            onEyeClick={() => handleEyeClick(arg)}
          />
        );
      }
    },
    [handleEventClick, handleEyeClick]
  );
  const eventDidMountCb = useCallback((info: any) => {
    if (info.event.display === "background") {
      info.el.style.zIndex = "9999";
      info.el.style.pointerEvents = "none";
      info.el.style.backgroundColor = info.event.extendedProps.color;
    }
  }, []);

  const calendarRef = useRef<FullCalendar>(null);

  return (
    <div className="relative w-full h-full">
      <AsyncCourses
        sections={sections}
        onHeightChange={handleAsyncCoursesHeightChange}
      />
      <div
        ref={containerRef}
        className={`
          border border-slate-200 dark:border-slate-700
          rounded-md bg-white dark:bg-slate-900
          text-slate-900 dark:text-slate-100
          custom-tr-height custom-td-color
          overflow-hidden w-full h-full flex flex-col
          ${
            !isProfilePage
              ? `
            max-h-[calc(100vh-16rem)]
            sm:max-h-[calc(100vh-13rem)]
            md:max-h-[calc(100vh-10rem)]
            lg:max-h-[calc(100vh-8rem)]
          `
              : ""
          }
        `}
      >
        <ScrollArea className="h-full w-full">
          <FullCalendar
            ref={calendarRef}
            plugins={plugins}
            initialView="timeGridWeek"
            initialDate={monday}
            timeZone="local"
            headerToolbar={headerToolbar}
            selectable={true}
            selectMirror={true}
            select={handleSelect}
            allDaySlot={false}
            slotMinTime="07:00:00"
            slotMaxTime="21:00:00"
            slotDuration="01:00:00"
            hiddenDays={[0, 6]}
            events={allEvents}
            contentHeight={isProfilePage ? "80vh" : calendarHeight}
            expandRows={true}
            titleFormat={titleFormat}
            dayHeaderContent={dayHeaderContent}
            dayHeaderClassNames={dayHeaderClassNames}
            slotLabelFormat={slotLabelFormat as any}
            slotLabelClassNames={slotLabelClassNames}
            dayCellClassNames={dayCellClassNames}
            stickyHeaderDates={true}
            eventColor="#334155"
            eventClassNames={eventClassNamesCb}
            eventContent={eventContentCb}
            nowIndicator={false}
            eventDidMount={eventDidMountCb}
          />
        </ScrollArea>
      </div>
      <div id="calendar-modal-root" />
    </div>
  );
};

export default WeeklySchedule;
