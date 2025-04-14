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
  min?: number;
  max?: number;
  step?: number;
  showLabel?: boolean;
  showRange?: boolean;
  toFixed?: number;
  labelStep?: number;
}

const DoubleSliderFilter: React.FC<InstructorRatingRangeFilterProps> = ({
  initialRange = [0, 4],
  label = "Stars",
  step = 0.1,
  min = 0,
  max = 4,
  onRangeChange,
  showLabel = true,
  showRange = true,
  toFixed = 1,
  labelStep = 1,
}) => {
  const [range, setRange] = useState<[number, number]>(initialRange);
  // start at min
  const labels = Array.from(
    { length: Math.ceil((max - min) / labelStep) + 1 },
    (_, i) => min + i * labelStep
  );
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
      {showLabel ? (
        <div className="flex items-center space-x-2 text-xs dark:text-gray-400">
          <span>
            {range[0].toFixed(toFixed)} - {range[1].toFixed(toFixed)} {label}
          </span>
        </div>
      ) : (
        <div className="h-1 bg-gray-300 rounded-full dark:bg-gray-300" />
      )}

      <DoubleSlider
        value={range}
        onValueChange={handleSliderChange}
        min={min}
        max={max}
        step={step}
        className="w-full h-1 bg-gray-300 rounded-full dark:bg-gray-300"
      />

      {/* Labels for the slider values */}
      {showRange && (
        <div className="flex justify-between w-full">
          {labels.map((value) => (
            <span key={value} className="text-sm dark:text-gray-400 ml-1">
              {value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoubleSliderFilter;
