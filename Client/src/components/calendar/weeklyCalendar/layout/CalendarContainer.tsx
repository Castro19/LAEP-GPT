import {
  CalendarAverageRating,
  NoSelectedSections,
  WeeklyCalendar,
} from "@/components/calendar";
import { useAppSelector } from "@/redux";
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";

const CalendarContainer = () => {
  const isNarrowScreen = useIsNarrowScreen();
  const { schedules, currentSchedule } = useAppSelector(
    (state) => state.schedule
  );

  if (!currentSchedule && schedules.length === 0) {
    return (
      <div className="items-start justify-start">
        <NoSelectedSections />
      </div>
    );
  }

  if (!currentSchedule) {
    return <div>Build a schedule first</div>;
  }

  return (
    <div className="flex flex-col gap-4 w-full overflow-hidden no-scroll">
      <div className="overflow-auto no-scroll">
        <CalendarAverageRating />
        <WeeklyCalendar
          sections={currentSchedule.sections}
          height={isNarrowScreen ? "70vh" : "80vh"}
        />
      </div>
    </div>
  );
};

export default CalendarContainer;
