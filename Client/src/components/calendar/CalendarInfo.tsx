import React from "react";
import { useAppSelector } from "@/redux";
import { Star } from "../section/StarRating";
import { Card } from "../ui/card";

const ScheduleCard: React.FC = () => {
  const { calendars, page } = useAppSelector((state) => state.calendar);

  if (calendars.length === 0) {
    return null;
  }

  // Get the current calendar using the page value
  const currentCalendar = calendars[page - 1];

  // Compute the overall and average rating from the calendar sections
  const overallRating = currentCalendar.sections.reduce(
    (acc, section) => acc + section.rating,
    0
  );
  const averageRating = overallRating / currentCalendar.sections.length;

  const stars = Array.from({ length: 4 }, (_, index) => {
    const fillPercentage = Math.max(0, Math.min(1, averageRating - index));
    return <Star key={index} fillPercentage={fillPercentage} />;
  });
  return (
    <Card className="p-1 border-gray-300 border-2">
      <h2 className="text-lg font-semibold">Schedule Average Rating</h2>
      <div className="flex justify-start gap-1">
        <div className="flex items-center">{stars}</div>
        <strong className="text-md text-white">
          {averageRating.toFixed(1)}
        </strong>
        <span className="text-gray-400">/ 4</span>
      </div>
    </Card>
  );
};

export default ScheduleCard;
