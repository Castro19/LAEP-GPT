// CourseItem.tsx
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Course, FlowchartData } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import _ from "lodash"; // Import lodash
import { useAppDispatch, useAppSelector } from "@/redux";
import { setFlowchartData } from "@/redux/flowchart/flowchartSlice";
import { TrashIcon } from "lucide-react";

interface CourseItemProps {
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
  const updatedFlowchartData = _.cloneDeep(flowchartData);

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
    console.error("Invalid course position");
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

const CourseItem: React.FC<CourseItemProps> = ({
  termIndex,
  course,
  coursePosition,
  onToggleComplete,
}) => {
  const dispatch = useAppDispatch();
  const flowchartData = useAppSelector(
    (state) => state.flowchart.flowchartData
  );
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
      dispatch(setFlowchartData(updatedFlowchartData));
    }
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Card
                onClick={handleClick}
                className={`w-full h-40 flex-shrink-0 flex-grow-0 rounded-lg shadow-md transition-transform duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg cursor-pointer overflow-hidden ${
                  course.completed ? "dark:bg-gray-300" : ""
                }`}
                style={{
                  backgroundColor: course.completed ? undefined : course.color,
                  textDecoration: course.completed ? "line-through" : "none",
                }}
              >
                <div className="flex flex-col h-full">
                  <CardHeader className="flex-shrink-0 space-y-1 p-3">
                    <CardTitle className="text-lg font-semibold dark:text-gray-900">
                      {course.id || course.customId || "No Course ID"}
                    </CardTitle>
                    <CardDescription className="text-sm dark:text-gray-600">
                      {course.displayName ||
                        course.customDisplayName ||
                        course.id}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    {course.units && (
                      <p className="text-sm dark:text-gray-600">
                        Units: {course.units}
                      </p>
                    )}
                    {course.customUnits && (
                      <p className="text-sm dark:text-gray-600">
                        Units: {course.customUnits}
                      </p>
                    )}
                  </CardContent>
                </div>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p className="p-4 text-md dark:bg-slate-800 hover:dark:bg-slate-700 dark:text-gray-200 rounded-2xl text-left max-h-[400px] whitespace-pre-wrap overflow-y-auto max-w-[400px]">
                {course.desc || course.customDesc || "No Description"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </ContextMenuTrigger>
    </ContextMenu>
  );
};

export default CourseItem;