import { Card } from "@/components/ui/card";
import { useAppSelector } from "@/redux";
import { motion } from "framer-motion";
import { FiFilter } from "react-icons/fi";

// Mapping of filter keys to user-friendly labels
const FILTER_LABELS: Record<string, string> = {
  status: "Status",
  subject: "Subject",
  days: "Days",
  timeRange: "Time Range",
  minInstructorRating: "Minimum Instructor Rating",
  maxInstructorRating: "Maximum Instructor Rating",
  includeUnratedInstructors: "Include Unrated Instructors",
  units: "Units",
  courseAttributes: "Course Attributes",
  instructionMode: "Instruction Mode",
  instructors: "Instructors",
};

// Mapping for instruction modes
const INSTRUCTION_MODE_MAP: Record<string, string> = {
  P: "Presential",
  A: "Asynchronous",
};

function hourIntToLabel(h24: number): string {
  const amPm = h24 < 12 ? "AM" : "PM";
  let h12 = h24 % 12;
  if (h12 === 0) {
    h12 = 12;
  }
  return `${h12}:00${amPm}`;
}

function valueToLabel(value: string): string {
  // If empty or missing, return an empty string.
  if (!value) return "";
  // Expecting “HH:MM”
  const [hourStr] = value.split(":");
  const hourInt = parseInt(hourStr, 10) || 0;
  return hourIntToLabel(hourInt);
}

// Helper function to format filter values
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatFilterValue = (key: string, value: any): string => {
  switch (key) {
    case "days":
      return value.join(", ");
    case "timeRange": {
      const [startTime, endTime] = value.split("-");
      return `${valueToLabel(startTime)} - ${valueToLabel(endTime)}`;
    }
    case "includeUnratedInstructors":
      return value ? "Yes" : "No";
    case "courseAttributes":
      return value.join(", ");
    case "instructionMode":
      return INSTRUCTION_MODE_MAP[value] || value;
    case "minInstructorRating":
    case "maxInstructorRating":
      return `${value} stars`;
    default:
      if (Array.isArray(value)) {
        return value.join(", ");
      }
      return value.toString();
  }
};

const NoSectionsFound: React.FC = () => {
  const { filters } = useAppSelector((state) => state.section);

  // Extract and format active filters
  const activeFilters = Object.entries(filters)
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    .filter(([_, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "boolean") return value;
      return value !== undefined && value !== null && value !== "";
    })
    .map(([key, value]) => ({
      label: FILTER_LABELS[key] || key,
      value: formatFilterValue(key, value),
    }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex justify-center items-center h-full p-4"
    >
      <Card className="w-full max-w-md p-6 space-y-6 text-center">
        <FiFilter className="w-12 h-12 text-gray-400 mx-auto" />
        <h2 className="text-2xl font-semibold">No Results Found</h2>
        <p className="text-gray-600">
          The filters you selected did not match any courses. Please try
          adjusting your filters or clearing them to see all available courses.
        </p>

        {activeFilters.length > 0 && (
          <div className="text-left">
            <h3 className="text-lg font-medium mb-2">Active Filters:</h3>
            <ul className="list-disc list-inside space-y-1">
              {activeFilters.map((filter) => (
                <li key={filter.label}>
                  <strong>{filter.label}:</strong> {filter.value}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default NoSectionsFound;
