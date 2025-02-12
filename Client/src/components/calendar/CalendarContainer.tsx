import CalendarInfo from "./CalendarInfo";
import { PaginationFooter } from "./PaginationFooter";
import WeeklyCalendar from "./WeeklyCalendar";
import { useAppSelector } from "@/redux";
const CalendarContainer = () => {
  const { calendars, currentCalendar } = useAppSelector(
    (state) => state.calendar
  );

  if (!currentCalendar && calendars.length === 0) {
    return <div>Build a schedule first</div>;
  }

  if (!currentCalendar) {
    return <div>Build a schedule first</div>;
  }
  return (
    <div className="flex flex-col gap-4 w-full min-h-screen overflow-hidden no-scroll">
      <div className="overflow-auto flex-1 no-scroll">
        <CalendarInfo />
        <WeeklyCalendar sections={currentCalendar.sections} />
        <PaginationFooter />
      </div>
    </div>
  );
};

export default CalendarContainer;
