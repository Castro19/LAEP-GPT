import {
  NoSelectedSections,
  ScheduleAverageRating,
  WeeklySchedule,
} from "@/components/scheduleBuilder";
import { useAppSelector } from "@/redux";
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";
import AsyncCourses from "../weeklySchedule/AsyncCourses";
import { useState } from "react";

const ScheduleContainer = () => {
  const isNarrowScreen = useIsNarrowScreen();
  const { schedules, currentSchedule } = useAppSelector(
    (state) => state.schedule
  );
  const [asyncCoursesHeight, setAsyncCoursesHeight] = useState(0);

  // Handle AsyncCourses height changes
  const handleAsyncCoursesHeightChange = (height: number) => {
    setAsyncCoursesHeight(height);
  };

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
    <div className="flex flex-col h-full w-full overflow-hidden no-scroll">
      <div className="overflow-auto no-scroll flex-grow">
        <ScheduleAverageRating />
        {/* Add the AsyncCourses component above the calendar */}
        <AsyncCourses
          sections={currentSchedule.sections}
          onHeightChange={handleAsyncCoursesHeightChange}
        />
        <WeeklySchedule
          sections={currentSchedule.sections}
          asyncCoursesHeight={asyncCoursesHeight}
          height={isNarrowScreen ? "70vh" : "80vh"}
        />
      </div>
    </div>
  );
};

export default ScheduleContainer;
