import { FC, MouseEvent } from "react";
import { motion } from "framer-motion";
import {
  EyeIcon,
  CalendarMinus,
  ChevronRight,
  CalendarPlus,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipPortal,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { adjustColorBrightness } from "./utils";
import type { SelectedSection } from "@polylink/shared/types";
import ProfessorCollapsibleCard from "./ProfessorCollapsibleTrigger";

export interface CourseAccordionProps {
  courseId: string;
  professorGroups: Record<
    string,
    { rating: number; sections: SelectedSection[] }
  >;
  courseIndex: number;
  conflictIds: Set<number>;
  sectionsForSchedule: SelectedSection[];
  /** computed booleans */
  isInSchedule: boolean;
  isHidden: boolean;
  /** handlers */
  onAddCourse: (courseId: string) => void;
  onRemoveCourse: (courseId: string) => void;
  onToggleVisibility: (courseId: string) => void;
}

const CourseAccordion: FC<CourseAccordionProps> = ({
  courseId,
  professorGroups,
  courseIndex,
  conflictIds,
  sectionsForSchedule,
  isInSchedule,
  isHidden,
  onAddCourse,
  onRemoveCourse,
  onToggleVisibility,
}) => {
  const firstProfKey = Object.keys(professorGroups)[0];
  const bgColor = professorGroups[firstProfKey].sections[0].color || "#ffffff";
  const isConflicted = Object.values(professorGroups)
    .flatMap((g) => g.sections)
    .some((s) => conflictIds.has(s.classNumber));

  const sectionCount = Object.values(professorGroups).flatMap(
    (g) => g.sections
  ).length;

  return (
    <motion.div
      key={courseId}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{
        duration: 0.4,
        delay: 0.1 + courseIndex * 0.03,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="w-full"
    >
      <Collapsible className="group/collapsible w-full">
        <div
          className={`rounded-md border w-full ${isConflicted ? "ring-2 ring-red-500/60" : ""}`}
          style={{
            backgroundColor: bgColor,
            borderLeft: isConflicted
              ? "6px solid rgba(239, 68, 68, 0.8)"
              : "1px solid #e5e7eb",
          }}
        >
          <CollapsibleTrigger asChild>
            <div
              className="flex justify-between items-center p-3 cursor-pointer transition-colors border-b border-gray-100 dark:border-slate-700 w-full"
              style={{ backgroundColor: bgColor }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = adjustColorBrightness(
                  bgColor,
                  -5
                );
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = bgColor;
              }}
            >
              {/* Left side: chevron + title */}
              <div className="flex items-center gap-2 min-w-0">
                <ChevronRight className="flex-shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-90 text-gray-700 dark:text-gray-800" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-base font-semibold text-slate-800 dark:text-slate-900 flex-shrink-0">
                      {courseId}
                    </h2>
                    <span className="text-xs text-slate-500 dark:text-slate-600 truncate min-w-0">
                      {sectionCount} section{sectionCount > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right side: buttons */}
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-1 rounded-md p-1 backdrop-blur-sm shadow-sm">
                  {isInSchedule ? (
                    <>
                      {/* Toggle visibility */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-gray-900 dark:text-black hover:bg-transparent dark:hover:bg-transparent hover:text-gray-950 dark:hover:text-gray-900"
                              onClick={(e: MouseEvent) => {
                                e.stopPropagation();
                                onToggleVisibility(courseId);
                              }}
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipPortal>
                            <TooltipContent
                              side="top"
                              sideOffset={5}
                              className="z-[100]"
                              avoidCollisions
                            >
                              {isHidden
                                ? "Show all sections"
                                : "Hide all sections"}
                            </TooltipContent>
                          </TooltipPortal>
                        </Tooltip>
                      </TooltipProvider>

                      {/* Remove from calendar */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-black dark:text-red-700 hover:bg-transparent dark:hover:bg-transparent hover:text-red-600 dark:hover:text-red-600"
                              onClick={(e: MouseEvent) => {
                                e.stopPropagation();
                                onRemoveCourse(courseId);
                              }}
                            >
                              <CalendarMinus className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipPortal>
                            <TooltipContent
                              side="top"
                              sideOffset={5}
                              className="z-[100]"
                              avoidCollisions
                            >
                              Remove all sections from calendar
                            </TooltipContent>
                          </TooltipPortal>
                        </Tooltip>
                      </TooltipProvider>
                    </>
                  ) : (
                    /* Add to calendar */
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-black dark:text-green-700 hover:bg-transparent dark:hover:bg-transparent hover:text-green-600 dark:hover:text-green-600"
                            onClick={(e: MouseEvent) => {
                              e.stopPropagation();
                              onAddCourse(courseId);
                            }}
                          >
                            <CalendarPlus className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipPortal>
                          <TooltipContent
                            side="top"
                            sideOffset={5}
                            className="z-[100]"
                            avoidCollisions
                          >
                            Add all sections to calendar
                          </TooltipContent>
                        </TooltipPortal>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="px-3 pb-3">
              {Object.entries(professorGroups).map(
                ([prof, { rating, sections }], profIdx) => (
                  <ProfessorCollapsibleCard
                    key={prof}
                    professor={prof}
                    rating={rating}
                    sections={sections}
                    professorGroups={professorGroups}
                    courseIndex={courseIndex}
                    profIdx={profIdx}
                    sectionsForSchedule={sectionsForSchedule}
                    conflictIds={conflictIds}
                  />
                )
              )}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </motion.div>
  );
};

export default CourseAccordion;
