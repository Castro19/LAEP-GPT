import CalendarInfo from "./CalendarInfo";
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
    <div className="flex flex-col gap-4 w-full overflow-hidden no-scroll">
      <div className="overflow-auto no-scroll">
        <CalendarInfo />
        <WeeklyCalendar
          sections={currentCalendar.sections}
          height={isMobile ? "70vh" : "80vh"}
        />
      </div>
    </div>
  );
};

export default CalendarContainer;
