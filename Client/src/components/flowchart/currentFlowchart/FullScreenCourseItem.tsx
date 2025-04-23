import { useAppDispatch, useAppSelector, flowchartActions } from "@/redux";
import { Course, FlowchartData } from "@polylink/shared/types";
import cloneDeep from "lodash-es/cloneDeep";
import { useState } from "react";
// Env vars
import { environment } from "@/helpers/getEnvironmentVars";
// UI Components & Icon
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { TrashIcon } from "lucide-react";
import CourseToolTipContent from "./CourseTooltipContent";
import useDeviceType from "@/hooks/useDeviceType";

interface FullScreenCourseItemProps {
  termIndex: number;
  course: Course;
  coursePosition: number;
  // eslint-disable-next-line no-unused-vars
  onToggleComplete: (courseId: string | null) => void;
}

const deleteCourseFromTerm = (
  flowchartData: FlowchartData,
  termIndex: number,
  coursePosition: number
) => {
  // Create a deep copy of flowchartData
  const updatedFlowchartData: FlowchartData = cloneDeep(flowchartData);

  const correctIndex = updatedFlowchartData.termData.findIndex(
    (term) => term.tIndex === termIndex
  );
  if (
    coursePosition >= 0 &&
    coursePosition < updatedFlowchartData.termData[correctIndex].courses.length
  ) {
    // Remove the course at the specified position
    updatedFlowchartData.termData[correctIndex].courses.splice(
      coursePosition,
      1
    );
  } else {
    if (environment === "dev") {
      console.error("Invalid course position");
    }
  }
  // Calculate Units for all terms
  updatedFlowchartData.termData.forEach((term) => {
    term.tUnits = term.courses
      .reduce((acc, course) => {
        const unitValue = course.customUnits || course.units; // Prefer customUnits if available
        if (unitValue) {
          // Check if the unitValue is a range (e.g., "1-4")
          const rangeMatch = unitValue.match(/^(\d+)-(\d+)$/);
          if (rangeMatch) {
            // If it's a range, calculate the average or total
            const min = Number(rangeMatch[1]);
            const max = Number(rangeMatch[2]);
            return acc + (min + max) / 2; // You can choose to sum or average
          }
          return acc + (Number(unitValue) || 0); // Fallback to number conversion
        }
        return acc; // If no units, return accumulated value
      }, 0)
      .toString();
  });
  return updatedFlowchartData;
};

const FullScreenCourseItem: React.FC<FullScreenCourseItemProps> = ({
  termIndex,
  course,
  coursePosition,
  onToggleComplete,
}) => {
  const dispatch = useAppDispatch();
  const flowchartData = useAppSelector(
    (state) => state.flowchart.flowchartData
  );
  const device = useDeviceType();

  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const handleClick = () => {
    onToggleComplete(course.id);
  };

  const handleDelete = () => {
    if (flowchartData) {
      const updatedFlowchartData = deleteCourseFromTerm(
        flowchartData,
        termIndex,
        coursePosition
      );
      dispatch(flowchartActions.setFlowchartData(updatedFlowchartData));
    }
  };

  const toggleTooltip = () => {
    setIsTooltipOpen(!isTooltipOpen);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            inset
            onClick={handleDelete}
            className="hover:bg-red-500 w-auto"
          >
            <div className="flex items-center gap-2 dark:hover:text-red-500">
              Remove
              <TrashIcon className="w-4 h-4" />
            </div>
          </ContextMenuItem>
        </ContextMenuContent>
        <TooltipProvider>
          <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
            <TooltipTrigger asChild>
              <Card
                onClick={(e) => {
                  e.stopPropagation();
                  if (device !== "desktop") {
                    toggleTooltip();
                  }
                  handleClick();
                }}
                className={`w-full rounded-md shadow-sm transition-transform duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-md cursor-pointer overflow-hidden ${
                  course.completed ? "dark:bg-gray-300" : ""
                }`}
                style={{
                  backgroundColor: course.completed ? undefined : course.color,
                  textDecoration: course.completed ? "line-through" : "none",
                }}
              >
                <div className="p-1.5 flex flex-col">
                  {/* Course ID section */}
                  <div
                    className={`text-[10px] font-semibold truncate ${
                      course.completed ? "dark:text-gray-900" : "text-gray-900"
                    }`}
                  >
                    {course.id || course.customId || "No Course ID"}
                  </div>

                  {/* Course name section */}
                  <div
                    className={`text-[9px] break-words ${
                      course.completed ? "dark:text-gray-600" : "text-gray-600"
                    }`}
                  >
                    {course.displayName || course.customDisplayName}
                  </div>

                  {/* Units section with top margin */}
                  <div
                    className={`text-[9px] mt-3 ${
                      course.completed ? "dark:text-gray-600" : "text-gray-600"
                    }`}
                  >
                    Units: {course.units || course.customUnits}
                  </div>
                </div>
              </Card>
            </TooltipTrigger>
            <CourseToolTipContent course={course} />
          </Tooltip>
        </TooltipProvider>
      </ContextMenuTrigger>
    </ContextMenu>
  );
};

export default FullScreenCourseItem;
