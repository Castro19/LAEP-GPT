import CalendarInfo from "./CalendarInfo";
import { PaginationFooter } from "./PaginationFooter";
import WeeklyCalendar from "./WeeklyCalendar";
import { useAppSelector } from "@/redux";
import useIsMobile from "@/hooks/use-mobile";
const CalendarContainer = () => {
  const isMobile = useIsMobile();
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
        <WeeklyCalendar
          sections={currentCalendar.sections}
          height={isMobile ? "70vh" : "80vh"}
        />
        <PaginationFooter />
      </div>
    </div>
  );
};

export default CalendarContainer;
