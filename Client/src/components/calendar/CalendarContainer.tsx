import CalendarInfo from "./CalendarInfo";
import { PaginationFooter } from "./PaginationFooter";
import WeeklyCalendar from "./WeeklyCalendar";
import { useAppSelector } from "@/redux";
const CalendarContainer = () => {
  const { calendars, page } = useAppSelector((state) => state.calendar);

  if (calendars.length === 0 || !Array.isArray(calendars)) {
    return <div>Build a schedule first</div>;
  }
  const sections = calendars[page - 1]?.sections;
  if (!sections) {
    return <div>Build a schedule first</div>;
  }
  return (
    <div className="flex flex-col gap-4 w-full min-h-screen overflow-hidden no-scroll">
      <div className="overflow-auto flex-1 no-scroll">
        <CalendarInfo />
        <WeeklyCalendar sections={sections} />
        <PaginationFooter />
      </div>
    </div>
  );
};

export default CalendarContainer;
