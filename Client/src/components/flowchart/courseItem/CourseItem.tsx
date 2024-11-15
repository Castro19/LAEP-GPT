// CourseItem.tsx
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Course } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CourseItemProps {
  course: Course;
  // eslint-disable-next-line no-unused-vars
  onToggleComplete: (courseId: string | null) => void;
}

const CourseItem: React.FC<CourseItemProps> = ({
  course,
  onToggleComplete,
}) => {
  const handleClick = () => {
    onToggleComplete(course.id);
  };

  return (
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
                  {course.displayName || course.customDisplayName || course.id}
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
  );
};

export default CourseItem;
