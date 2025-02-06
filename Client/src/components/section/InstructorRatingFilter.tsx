import React, { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Star } from "./StarRating"; // Assuming Star is exported from StarRating

interface InstructorRatingFilterProps {
  initialRating?: number;
  // eslint-disable-next-line no-unused-vars
  onRatingChange: (rating: number) => void;
}

interface InstructorRatingFilterProps {
  initialRating?: number;
  // eslint-disable-next-line no-unused-vars
  onRatingChange: (rating: number) => void;
}

const InstructorRatingFilter: React.FC<InstructorRatingFilterProps> = ({
  initialRating = 0,
  onRatingChange,
}) => {
  const [rating, setRating] = useState(initialRating);

  // Synchronize the internal state with any changes to initialRating (e.g., after a form reset)
  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleSliderChange = (value: number[]) => {
    const newRating = value[0];
    setRating(newRating);
    onRatingChange(newRating);
  };

  const totalStars = 4;
  const stars = Array.from({ length: totalStars }, (_, index) => {
    const fillPercentage = Math.max(0, Math.min(1, rating - index));
    return <Star key={index} fillPercentage={fillPercentage} />;
  });

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex items-center">{stars}</div>
      <Slider
        value={[rating]}
        onValueChange={handleSliderChange}
        max={totalStars}
        step={0.1}
        className="w-full h-1 bg-gray-300 rounded-full"
      />
    </div>
  );
};

export default InstructorRatingFilter;
