import React from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { SelectedSection } from "@polylink/shared/types";
import { ScrollArea } from "@/components/ui/scroll-area";

type WeeklyCalendarProps = {
  sections: SelectedSection[];
};

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ sections }) => {
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
          title: `${section.component} ${section.classNumber} – ${section.courseId}`,
          start,
          end,
        };
      });
    })
  );

  return (
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
      <ScrollArea className="h-full min-w-full mb-4">
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
          initialView="timeGridWeek"
          initialDate={monday} // Ensure we show the week starting with our computed Monday
          timeZone="local" // or "UTC" if that is what you need
          headerToolbar={{ left: "", center: "", right: "" }}
          selectable={false}
          allDaySlot={false}
          slotMinTime="07:00:00"
          slotMaxTime="21:00:00"
          // If you want to show weekend meetings, do not hide days.
          // Otherwise, you can hide them by setting hiddenDays={[0,6]}
          events={events}
          height="85vh"
          titleFormat={{}} // (Empty: no title text on top)
          dayHeaderContent={(args) => {
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
          slotLabelClassNames="bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-slate-500 text-sm"
          dayCellClassNames="border border-slate-200 dark:border-slate-700"
          stickyHeaderDates={true}
          eventColor="#3b82f6"
          eventContent={(arg) => (
            <div className="h-full flex items-center justify-center p-1">
              <div className="w-full rounded-sm bg-blue-100 dark:bg-blue-900 p-1 text-sm">
                {arg.event.title}
              </div>
            </div>
          )}
          nowIndicator={false}
        />
      </ScrollArea>
    </div>
  );
};

export default WeeklyCalendar;
