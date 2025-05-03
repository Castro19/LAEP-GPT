import {
  NoSelectedSections,
  ScheduleAverageRating,
  WeeklySchedule,
} from "@/components/scheduleBuilder";
import { useAppSelector } from "@/redux";

const ScheduleContainer = () => {
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
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-none">
          <ScheduleAverageRating />
        </div>
        <div className="flex-1">
          <WeeklySchedule sections={currentSchedule.sections} />
        </div>
      </div>
    </div>
  );
};

export default ScheduleContainer;
