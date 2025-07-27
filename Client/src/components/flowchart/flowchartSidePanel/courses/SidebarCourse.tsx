/**
 * @component SidebarCourse
 * @description Individual course display component for sidebar. Shows course information
 * with completion status and tooltip with course description.
 *
 * @props
 * @prop {Course} course - Course data to display
 *
 * @dependencies
 * - Redux: flowchart state for completed courses
 * - Tooltip: Course description display
 * - Card: Course display container
 * - useMemo: Performance optimization for completion check
 *
 * @features
 * - Course ID and display name
 * - Completion status with visual feedback
 * - Tooltip with course description
 * - Hover animations and transitions
 * - Color-coded course display
 * - Responsive design
 * - Performance optimization
 *
 * @example
 * ```tsx
 * <SidebarCourse course={courseData} />
 * ```
 */

import { useMemo } from "react";
import { useAppSelector } from "@/redux";
import { Course } from "@polylink/shared/types";

// UI Components
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const SidebarCourse = ({ course }: { course: Course }) => {
  const { completedCourseIds } = useAppSelector((state) => state.flowchart);

  // Check if this course is completed using the Redux state
  const isCompleted = useMemo(() => {
    const courseId = course.id || course.customId;
    return courseId ? completedCourseIds.includes(courseId) : false;
  }, [completedCourseIds, course.id, course.customId]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className={`w-full flex-shrink-0 flex-grow-0 rounded-lg shadow-md transition-transform duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg cursor-pointer overflow-hidden relative ${
              isCompleted ? "dark:bg-gray-300" : ""
            }`}
            style={{
              backgroundColor: isCompleted ? undefined : course.color,
              textDecoration: isCompleted ? "line-through" : "none",
            }}
          >
            <div className="flex flex-col h-full">
              <CardHeader className="flex-shrink-0 space-y-1 p-3">
                <CardTitle className="text-md font-semibold dark:text-gray-900">
                  {`${course.id} - ${course.displayName}`}
                </CardTitle>
              </CardHeader>
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
  );
};

export default SidebarCourse;
