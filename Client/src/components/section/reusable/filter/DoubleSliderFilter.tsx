import React, { useEffect, useState } from "react";

import { DoubleSlider } from "@/components/ui/slider";

interface InstructorRatingRangeFilterProps {
  /**
   * The initial range for min and max rating, e.g. [0, 4]
   */
  initialRange?: [number, number];
  /**
   * Callback with the updated [min, max] whenever the slider changes
   */
  // eslint-disable-next-line no-unused-vars
  onRangeChange: (range: [number, number]) => void;
  label?: string;
  max?: number;
  step?: number;
  showRange?: boolean;
}

const InstructorRatingFilter: React.FC<InstructorRatingRangeFilterProps> = ({
  initialRange = [0, 4],
  label = "Stars",
  step = 0.1,
  max = 4,
  onRangeChange,
  showRange = true,
}) => {
  const [range, setRange] = useState<[number, number]>(initialRange);
  const labels = Array.from({ length: max + 1 }, (_, i) => i);
  // Keep local state in sync if the form resets/updates from outside
  useEffect(() => {
    setRange(initialRange);
  }, [initialRange]);

  const handleSliderChange = (value: number[]) => {
    // Radix slider returns an array of two values for a double slider
    const [minRating, maxRating] = value as [number, number];
    setRange([minRating, maxRating]);
    onRangeChange([minRating, maxRating]);
  };

  return (
    <div className="flex flex-col items-center space-y-2 w-full mt-2">
      {/* You can display the current values, star icons, etc. */}
      <div className="flex items-center space-x-2 text-xs dark:text-gray-400">
        <span>
          {range[0].toFixed(1)} - {range[1].toFixed(1)} {label}
        </span>
      </div>

      <DoubleSlider
        value={range}
        onValueChange={handleSliderChange}
        min={0}
        max={max}
        step={step}
        className="w-full h-1 bg-gray-300 rounded-full dark:bg-gray-300"
      />

      {/* Labels for the slider values */}
      {showRange && (
        <div className="flex justify-between w-full px-2">
          {labels.map((value) => (
            <span key={value} className="text-sm dark:text-gray-400">
              {value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorRatingFilter;
