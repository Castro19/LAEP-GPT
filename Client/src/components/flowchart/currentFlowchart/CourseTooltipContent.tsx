/**
 * @component CourseTooltipContent
 * @description Detailed course information display for tooltips. Shows course details,
 * prerequisites, and additional information.
 *
 * @props
 * @prop {Course} course - Course data to display in tooltip
 *
 * @dependencies
 * - Course: Course type from shared types
 * - TooltipContent: UI tooltip container
 *
 * @features
 * - Course ID and display name
 * - Unit information
 * - Prerequisites display
 * - Course description
 * - Custom course information
 * - Responsive tooltip layout
 *
 * @example
 * ```tsx
 * <CourseTooltipContent course={courseData} />
 * ```
 */

import { Course } from "@polylink/shared/types";
import { TooltipContent } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

const CourseToolTipContent = ({ course }: { course: Course }) => {
  // Process the additional information text
  const processAdditionalInfo = (text: string) => {
    if (!text) return null;

    // Split by newlines and filter out empty lines
    const lines = text.split("\n").filter((line) => line.trim() !== "");

    // Process each line
    const processedItems: JSX.Element[] = [];

    lines.forEach((line, lineIndex) => {
      // Check if it's a prerequisite, corequisite, or recommendation line
      if (
        line.toLowerCase().includes("prerequisite:") ||
        line.toLowerCase().includes("corequisite:") ||
        line.toLowerCase().includes("recommended:")
      ) {
        // Split by colon to separate label and content
        const [label, ...contentParts] = line.split(":");
        const content = contentParts.join(":").trim();

        // Split the content by periods to separate multiple requirements
        const requirements = content
          .split(/\.(?=\s*[A-Z])/)
          .filter((req) => req.trim() !== "");

        // Add the main label as a header
        processedItems.push(
          <li
            key={`${lineIndex}-header`}
            className="text-sm text-gray-300 mb-1"
          >
            <span className="font-bold text-white">{label}:</span>
          </li>
        );

        // Add each requirement as a sub-bullet point
        requirements.forEach((req, reqIndex) => {
          const trimmedReq = req.trim();
          if (trimmedReq) {
            processedItems.push(
              <li
                key={`${lineIndex}-${reqIndex}`}
                className="text-sm text-gray-300 mb-1 ml-4"
              >
                {trimmedReq}
              </li>
            );
          }
        });
      } else {
        // For other lines, just bold the part before the colon if it exists
        const colonIndex = line.indexOf(":");
        if (colonIndex > 0) {
          const label = line.substring(0, colonIndex);
          const content = line.substring(colonIndex + 1).trim();

          processedItems.push(
            <li key={lineIndex} className="text-sm text-gray-300 mb-1">
              <span className="font-bold text-white">{label}:</span> {content}
            </li>
          );
        } else {
          // For lines without colons, just return as is
          processedItems.push(
            <li key={lineIndex} className="text-sm text-gray-300 mb-1">
              {line}
            </li>
          );
        }
      }
    });

    return processedItems;
  };

  const listItems = course.addl ? processAdditionalInfo(course.addl) : null;

  return (
    <TooltipPrimitive.Portal>
      <TooltipContent
        className="dark:bg-gray-800 border border-gray-700 shadow-xl z-[9999]"
        sideOffset={5}
        align="center"
      >
        <div className="flex flex-col gap-3 p-3 min-w-[300px] max-w-[400px]">
          {/* Header Section */}
          <div className="space-y-1">
            <p className="text-lg font-bold text-white">
              {course.id || course.customId}
            </p>
            <p className="text-sm text-gray-300">
              {course.displayName || course.customDisplayName || course.id}
            </p>
          </div>

          <hr className="border-gray-600" />

          {/* Description Section */}
          <div
            className="text-sm leading-relaxed text-gray-200 max-h-[250px] overflow-y-auto pr-2 
              scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
          >
            {course.desc || course.customDesc || "No Description"}
          </div>

          <hr className="border-gray-600" />
          <div className="flex flex-col justify-start items-start text-sm text-gray-300">
            {listItems && (
              <ul className="list-disc pl-4 w-full text-left">
                {listItems || "No Additional Information"}
              </ul>
            )}
          </div>
        </div>
      </TooltipContent>
    </TooltipPrimitive.Portal>
  );
};

export default CourseToolTipContent;
