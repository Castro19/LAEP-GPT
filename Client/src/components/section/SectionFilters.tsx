/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { RiFilterLine } from "react-icons/ri";
import { SectionsFilterParams } from "@polylink/shared/types";

type SectionFiltersProps = {
  filters: SectionsFilterParams;
  handleSetSelectedFilters: (
    filter: keyof SectionsFilterParams,
    value: string
  ) => void;
};

const SectionFilters = ({
  filters,
  handleSetSelectedFilters,
}: SectionFiltersProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <RiFilterLine className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-semibold">Filter Sections</h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Narrow down the available sections
          </p>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium">
            Subject
          </label>
          <input
            id="subject"
            type="text"
            value={filters.subject}
            onChange={(e) =>
              handleSetSelectedFilters("subject", e.target.value)
            }
            className="w-full mt-1 p-2 border border-gray-300 rounded outline-none focus:border-blue-500"
          />
        </div>

        {/* Course ID */}
        <div>
          <label htmlFor="courseId" className="block text-sm font-medium">
            Course ID
          </label>
          <input
            id="courseId"
            type="text"
            value={filters.courseId}
            onChange={(e) =>
              handleSetSelectedFilters("courseId", e.target.value)
            }
            className="w-full mt-1 p-2 border border-gray-300 rounded outline-none focus:border-blue-500"
          />
        </div>

        {/* Status (Open/Closed) */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => handleSetSelectedFilters("status", e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded outline-none focus:border-blue-500"
          >
            <option value="">Any</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Days Checkboxes */}
        <div>
          <p className="text-sm font-medium">Days</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
              <label key={day} className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={filters.days?.includes(day)}
                  onChange={() => handleSetSelectedFilters("days", day)}
                />
                <span>{day}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Time Range (Start - End) */}
        <div>
          <p className="text-sm font-medium">Time Range</p>
          <div className="flex items-center space-x-2 mt-1">
            <input
              type="time"
              value={filters.timeRange?.split("-")[0]}
              onChange={(e) =>
                handleSetSelectedFilters("timeRange", e.target.value)
              }
              className="w-1/2 p-2 border border-gray-300 rounded outline-none focus:border-blue-500"
            />
            <input
              type="time"
              value={filters.timeRange?.split("-")[1]}
              onChange={(e) =>
                handleSetSelectedFilters("timeRange", e.target.value)
              }
              className="w-1/2 p-2 border border-gray-300 rounded outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Instructor Rating (>=) */}
        <div>
          <label
            htmlFor="instructorRating"
            className="block text-sm font-medium"
          >
            Instructor Rating (≥)
          </label>
          <input
            id="instructorRating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={filters.instructorRating}
            onChange={(e) =>
              handleSetSelectedFilters("instructorRating", e.target.value)
            }
            className="w-full mt-1 p-2 border border-gray-300 rounded outline-none focus:border-blue-500"
          />
        </div>

        {/* Units */}
        <div>
          <label htmlFor="units" className="block text-sm font-medium">
            Units
          </label>
          <select
            id="units"
            value={filters.units}
            onChange={(e) => handleSetSelectedFilters("units", e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded outline-none focus:border-blue-500"
          >
            <option value="">Any</option>
            <option value="1-3">1-3</option>
            <option value="4+">4+</option>
          </select>
        </div>

        {/* Course Attribute */}
        <div>
          <label
            htmlFor="courseAttribute"
            className="block text-sm font-medium"
          >
            Course Attribute
          </label>
          <select
            id="courseAttribute"
            value={filters.courseAttribute}
            onChange={(e) =>
              handleSetSelectedFilters("courseAttribute", e.target.value)
            }
            className="w-full mt-1 p-2 border border-gray-300 rounded outline-none focus:border-blue-500"
          >
            <option value="">Any</option>
            <option value="GE A">GE A</option>
            <option value="GE B">GE B</option>
            <option value="GE C">GE C</option>
            <option value="GE D">GE D</option>
            <option value="GE E">GE E</option>
            <option value="GE F">GE F</option>
            <option value="USCP">USCP</option>
            <option value="GWR">GWR</option>
          </select>
        </div>

        {/* Instruction Mode */}
        <div>
          <label
            htmlFor="instructionMode"
            className="block text-sm font-medium"
          >
            Instruction Mode
          </label>
          <select
            id="instructionMode"
            value={filters.instructionMode}
            onChange={(e) =>
              handleSetSelectedFilters("instructionMode", e.target.value)
            }
            className="w-full mt-1 p-2 border border-gray-300 rounded outline-none focus:border-blue-500"
          >
            <option value="">Any</option>
            <option value="PA">PA (Synchronous)</option>
            <option value="SM">SM (Sync/Async Hybrid)</option>
            <option value="P">P (In Person/Async Hybrid)</option>
            <option value="PS">PS (In Person)</option>
            <option value="AM">AM (In Person/Sync Hybrid)</option>
            <option value="SA">SA (Asynchronous)</option>
          </select>
        </div>
      </Card>
    </motion.div>
  );
};

export default SectionFilters;
