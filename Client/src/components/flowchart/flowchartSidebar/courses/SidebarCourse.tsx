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
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className="w-full flex-shrink-0 flex-grow-0 rounded-lg shadow-md transition-transform duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg cursor-pointer overflow-hidden"
            style={{
              backgroundColor: course.color,
            }}
          >
            <div className="flex flex-col h-full">
              <CardHeader className="flex-shrink-0 space-y-1 p-3">
                <CardTitle className="text-md font-semibold dark:text-gray-900">
                  {`${course.id}` || `${course.customId}` || "No Course ID"}
                  {course.units && ` (${course.units} units)`}
                </CardTitle>
              </CardHeader>
            </div>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p className="p-4 text-md dark:bg-card hover:dark:bg-buttonHover dark:text-gray-200 rounded-2xl text-left max-h-[400px] whitespace-pre-wrap overflow-y-auto max-w-[400px]">
            {course.desc || course.customDesc || "No Description"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SidebarCourse;
