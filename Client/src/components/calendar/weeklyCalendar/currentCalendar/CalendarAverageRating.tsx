import React from "react";
import { useAppSelector } from "@/redux";
import { Star } from "@/components/classSearch/reusable/sectionInfo/StarRating";
import { Card } from "@/components/ui/card";

const CalendarAverageRating: React.FC = () => {
  const { schedules, page } = useAppSelector((state) => state.schedule);

  if (schedules.length === 0) {
    return null;
  }

  // Get the current calendar using the page value
  const currentSchedule = schedules[page - 1];
  const calculatedAverageRating = currentSchedule.averageRating.toFixed(1);
  const averageRating =
    calculatedAverageRating === "NaN" ? null : calculatedAverageRating;
  const stars = Array.from({ length: 4 }, (_, index) => {
    const fillPercentage = Math.max(
      0,
      Math.min(1, currentSchedule.averageRating - index)
    );
    return <Star key={index} fillPercentage={fillPercentage} />;
  });
  return (
    <Card className="p-1 border-gray-300 border-2">
      <h2 className="text-lg font-semibold">Schedule Average Rating</h2>
      <div className="flex justify-start gap-1">
        {averageRating ? (
          <>
            <div className="flex items-center">{stars}</div>
            <strong className="text-md text-white">{averageRating}</strong>
            <span className="text-gray-400">/ 4</span>
          </>
        ) : (
          <span className="text-gray-400">No rating available</span>
        )}
      </div>
    </Card>
  );
};

export default CalendarAverageRating;
