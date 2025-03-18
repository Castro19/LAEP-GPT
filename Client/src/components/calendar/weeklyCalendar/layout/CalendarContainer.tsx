import {
  CalendarAverageRating,
  NoSelectedSections,
  WeeklyCalendar,
} from "@/components/calendar";
import { useAppSelector } from "@/redux";
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";

const CalendarContainer = () => {
  const isNarrowScreen = useIsNarrowScreen();
  const { calendars, currentCalendar } = useAppSelector(
    (state) => state.calendar
  );

  if (!currentCalendar && calendars.length === 0) {
    return (
      <div className="items-start justify-start">
        <NoSelectedSections />
      </div>
    );
  }

  if (!currentCalendar) {
    return <div>Build a schedule first</div>;
  }

  return (
    <div className="flex flex-col gap-4 w-full overflow-hidden no-scroll">
      <div className="overflow-auto no-scroll">
        <CalendarAverageRating />
        <WeeklyCalendar
          sections={currentCalendar.sections}
          height={isNarrowScreen ? "70vh" : "80vh"}
        />
      </div>
    </div>
  );
};

export default CalendarContainer;
