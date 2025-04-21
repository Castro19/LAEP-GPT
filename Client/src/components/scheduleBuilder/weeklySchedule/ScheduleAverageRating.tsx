import React from "react";
import { useAppSelector } from "@/redux";
import { Star } from "@/components/classSearch/reusable/sectionInfo/StarRating";
import { Card } from "@/components/ui/card";
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";

const ScheduleAverageRating: React.FC = () => {
  const { currentSchedule, currentScheduleTerm } = useAppSelector(
    (state) => state.schedule
  );
  const isNarrowScreen = useIsNarrowScreen();

  if (!currentSchedule) {
    return null;
  }

  const calculatedAverageRating = currentSchedule.averageRating.toFixed(1);
  const averageRating =
    calculatedAverageRating === "NaN" ? null : calculatedAverageRating;

  const stars = Array.from({ length: 4 }, (_, index) => {
    const fillPercentage = Math.max(
      0,
      Math.min(1, currentSchedule.averageRating - index)
    );
    return (
      <Star
        key={index}
        fillPercentage={fillPercentage}
        isNarrowScreen={isNarrowScreen}
      />
    );
  });

  const formatTermDisplay = (term: string) => {
    if (term === "spring2025") {
      return "Spring 2025";
    } else if (term === "summer2025") {
      return "Summer 2025";
    }
    return term;
  };

  // Count lectures and labs
  const lectureCount = currentSchedule.sections.filter(
    (section) => section.component === "LEC"
  ).length;
  const labCount = currentSchedule.sections.filter(
    (section) => section.component === "LAB"
  ).length;

  // Count unique courses (by courseId)
  const uniqueCourses = new Set(
    currentSchedule.sections.map((section) => section.courseId)
  ).size;

  return (
    <Card className="p-3 bg-card/50 border-border/50">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-lg sm:text-xl font-bold truncate">
          {formatTermDisplay(currentScheduleTerm)}: {currentSchedule.name}
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm text-muted-foreground">
              Rating:
            </span>
            {averageRating ? (
              <>
                <div className="flex items-center gap-0.5">{stars}</div>
                <span className="text-sm font-medium">{averageRating}</span>
                <span className="text-xs text-muted-foreground">/ 4</span>
              </>
            ) : (
              <span className="text-xs sm:text-sm text-muted-foreground">
                No ratings available
              </span>
            )}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            {uniqueCourses} {uniqueCourses === 1 ? "Course" : "Courses"} •{" "}
            {lectureCount} {lectureCount === 1 ? "Lecture" : "Lectures"} •{" "}
            {labCount} {labCount === 1 ? "Lab" : "Labs"}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ScheduleAverageRating;
