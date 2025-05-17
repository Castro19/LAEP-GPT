import React from "react";
import { useAppSelector } from "@/redux";
import { Star } from "@/components/classSearch/reusable/sectionInfo/StarRating";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";

const ScheduleAverageRating: React.FC = () => {
  const { currentSchedule, currentScheduleTerm } = useAppSelector(
    (s) => s.schedule
  );
  const isNarrow = useIsNarrowScreen();
  if (!currentSchedule) return null;

  // stats
  const totalUnits = currentSchedule.sections.reduce(
    (sum, s) => sum + +s.units,
    0
  );
  const avg = parseFloat(currentSchedule.averageRating.toFixed(1));
  const hasRating = !isNaN(avg);
  const lec = currentSchedule.sections.filter(
    (s) => s.component === "LEC"
  ).length;
  const lab = currentSchedule.sections.filter(
    (s) => s.component === "LAB"
  ).length;
  const courses = new Set(currentSchedule.sections.map((s) => s.courseId)).size;

  const termLabel =
    {
      spring2025: "Spring 2025",
      summer2025: "Summer 2025",
      fall2025: "Fall 2025",
    }[currentScheduleTerm] || currentScheduleTerm;

  const stars = Array.from({ length: 4 }, (_, i) => {
    const fill = Math.max(0, Math.min(1, currentSchedule.averageRating - i));
    return <Star key={i} fillPercentage={fill} isNarrowScreen={isNarrow} />;
  });

  return (
    <Card className="flex items-center justify-between p-2 bg-card/50 border-border/50 rounded-lg shadow-sm">
      {/* Left: title + rating badge */}
      <div className="flex items-center space-x-2 overflow-hidden">
        <h2 className="text-sm font-bold truncate">
          {termLabel}: {currentSchedule.name}
        </h2>
        {hasRating && (
          <Badge
            variant="outline"
            className="flex items-center space-x-1 px-2 py-0.5 text-xs"
          >
            <div className="flex items-center space-x-0.5">{stars}</div>
            <span className="font-medium">{avg}</span>
          </Badge>
        )}
      </div>

      {/* Right: tiny stat badges */}
      <div className="flex items-center space-x-1 whitespace-nowrap">
        <Badge variant="secondary" className="px-2 py-0.5 text-xs">
          {courses} {courses === 1 ? "Course" : "Courses"}
        </Badge>
        <Badge variant="secondary" className="px-2 py-0.5 text-xs">
          {lec} {lec === 1 ? "Lecture" : "Lectures"}
        </Badge>
        <Badge variant="secondary" className="px-2 py-0.5 text-xs">
          {lab} {lab === 1 ? "Lab" : "Labs"}
        </Badge>
        <Badge variant="secondary" className="px-2 py-0.5 text-xs">
          {totalUnits} Units
        </Badge>
      </div>
    </Card>
  );
};

export default ScheduleAverageRating;
