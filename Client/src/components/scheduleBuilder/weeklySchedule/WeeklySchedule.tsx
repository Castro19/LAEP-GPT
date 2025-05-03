/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useCallback, useState } from "react";
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

// Components
import { ScheduleTimeSlots } from "@/components/scheduleBuilder";
import { ScrollArea } from "@/components/ui/scroll-area";
import AsyncCourses from "./AsyncCourses";
import CustomEventSlot from "./CustomEventSlot";
import { Modal } from "@/components/ui/animated-modal";

// Helpers
import {
  getConflictGroups,
  buildBackgroundEventsForGroup,
} from "@/components/scheduleBuilder";

// Types
import { SelectedSection } from "@polylink/shared/types";
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";

type WeeklyScheduleProps = {
  sections: SelectedSection[];
  isProfilePage?: boolean;
};

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({
  sections,
  isProfilePage = false,
}) => {
  const dispatch = useAppDispatch();
  const { currentScheduleTerm, hiddenSections } = useAppSelector(
    (s) => s.schedule
  );
  const customEvents = useAppSelector(
    (s) => s.schedule.currentSchedule?.customEvents || []
  );
  const [isExpanded, setIsExpanded] = useState(true);
  const isNarrowScreen = useIsNarrowScreen();

  // Get the start of the current week (Monday)
  const monday = useMemo(() => {
    const now = new Date();
    const offset = (now.getDay() + 6) % 7;
    const m = new Date(now);
    m.setDate(now.getDate() - offset);
    m.setHours(0, 0, 0, 0);
    return m;
  }, []);

  // Map day abbreviations to offsets
  const dayIndexMap = useMemo(
    () => ({
      Mo: 0,
      Tu: 1,
      We: 2,
      Th: 3,
      Fr: 4,
      Sa: 5,
      Su: 6,
    }),
    []
  );

  // Build regular class events
  const memoizedEvents = useMemo(() => {
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

          return {
            id: `${section.classNumber}-${day}-${meeting.start_time}-${meeting.end_time}`,
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
  }, [sections, monday, dayIndexMap]);

  // Build background conflict events
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

  // Build custom events
  const calendarCustomEvents = useMemo(() => {
    return customEvents.flatMap((evt) => {
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
          color: "#E5E7EB",
          extendedProps: {
            isCustomEvent: true,
            ...evt,
            currentDay: day,
          },
        };
      });
    });
  }, [customEvents, monday, dayIndexMap]);

  // Filter and combine all events
  const allEvents = useMemo(() => {
    const filteredEvents = [
      ...memoizedBackgroundEvents,
      ...memoizedEvents,
    ].filter(
      (e) =>
        !e.extendedProps?.classNumber ||
        !hiddenSections.includes(e.extendedProps.classNumber)
    );
    return [...filteredEvents, ...calendarCustomEvents];
  }, [
    memoizedBackgroundEvents,
    memoizedEvents,
    calendarCustomEvents,
    hiddenSections,
  ]);

  // Event handlers
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
        color: "#E5E7EB",
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

  // Calendar configuration
  const plugins = useMemo(
    () => [timeGridPlugin, interactionPlugin, dayGridPlugin],
    []
  );

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
      }
      return (
        <ScheduleTimeSlots
          event={arg.event}
          onClick={() => handleEventClick(arg)}
          onEyeClick={() => handleEyeClick(arg)}
        />
      );
    },
    [handleEventClick, handleEyeClick]
  );

  // Filter for asynchronous courses
  const asyncSections = sections.filter(
    (section) =>
      section.meetings.length === 0 ||
      section.meetings.every(
        (meeting) => !meeting.start_time || !meeting.end_time
      )
  );

  const hasAsyncCourses = asyncSections.length > 0;

  const calculateMaxHeight = useCallback(() => {
    if (isProfilePage) return "";

    const baseHeight = hasAsyncCourses ? 20 : 16;
    const narrowScreenAdjustment = isNarrowScreen ? 4 : 0;
    const expandedAdjustment = !isExpanded && hasAsyncCourses ? -4 : 0;

    return `max-h-[calc(100vh-${baseHeight + narrowScreenAdjustment + expandedAdjustment}rem)]`;
  }, [hasAsyncCourses, isNarrowScreen, isExpanded, isProfilePage]);

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-none">
        {hasAsyncCourses && (
          <AsyncCourses
            sections={sections}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
          />
        )}
      </div>
      <div
        className={`
          flex-1
          border border-slate-200 dark:border-slate-700
          rounded-md bg-white dark:bg-slate-900
          text-slate-900 dark:text-slate-100
          custom-tr-height custom-td-color w-full
          overflow-auto
          ${calculateMaxHeight()}
          fc-scroller no-scrollbar
        `}
      >
        <ScrollArea className="h-full w-full">
          <div className="h-full">
            <FullCalendar
              plugins={plugins}
              initialView="timeGridWeek"
              initialDate={monday}
              timeZone="local"
              headerToolbar={false}
              selectable={true}
              selectMirror={true}
              select={handleSelect}
              allDaySlot={false}
              slotMinTime="07:00:00"
              slotMaxTime="21:00:00"
              slotDuration="01:00:00"
              hiddenDays={[0, 6]}
              events={allEvents}
              height="auto"
              expandRows={true}
              stickyHeaderDates={true}
              eventColor="#E5E7EB"
              eventContent={eventContentCb}
              nowIndicator={false}
              dayHeaderFormat={{ weekday: "short" }}
              dayHeaderClassNames="bg-slate-800 text-white font-semibold border-slate-700"
            />
          </div>
        </ScrollArea>
      </div>
      <div id="calendar-modal-root" />
    </div>
  );
};

export default WeeklySchedule;
