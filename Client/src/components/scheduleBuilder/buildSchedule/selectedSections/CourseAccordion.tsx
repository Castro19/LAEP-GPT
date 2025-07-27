import { FC, MouseEvent, useEffect, useRef } from "react";
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
import { useAppSelector } from "@/redux";
import useAutoExpand from "@/hooks/useAutoExpand";
import { SCROLL_VIEWPORT_ID } from "../layout/BuildScheduleContainer";

/**
 * CourseAccordion - Collapsible component for displaying course sections grouped by professor
 *
 * This component provides an accordion interface for displaying all sections of a course,
 * organized by professor. It handles conflict detection, schedule management, and provides
 * smooth animations and scroll behavior for conflict resolution.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.courseId - The course identifier
 * @param {Record<string, {rating: number, sections: SelectedSection[]}>} props.professorGroups - Sections grouped by professor with ratings
 * @param {number} props.courseIndex - Index of this course in the list for animation timing
 * @param {number} props.conflictGroupIndex - Index of the conflict group this course belongs to
 * @param {number} props.positionInGroup - Position of this course within its conflict group
 * @param {Set<number>} props.conflictIds - Set of class numbers that have time conflicts
 * @param {SelectedSection[]} props.sectionsForSchedule - Sections currently selected for schedule building
 * @param {boolean} props.isInSchedule - Whether any section of this course is in the current schedule
 * @param {boolean} props.isHidden - Whether this course's sections are hidden
 * @param {function} props.onAddCourse - Callback to add all sections of this course to schedule
 * @param {function} props.onRemoveCourse - Callback to remove all sections of this course from schedule
 * @param {function} props.onToggleVisibility - Callback to toggle visibility of this course's sections
 *
 * @example
 * ```tsx
 * <CourseAccordion
 *   courseId="CSC 101"
 *   professorGroups={{
 *     "Dr. Smith": { rating: 4.5, sections: [section1, section2] },
 *     "Dr. Johnson": { rating: 4.2, sections: [section3] }
 *   }}
 *   courseIndex={0}
 *   conflictGroupIndex={1}
 *   positionInGroup={0}
 *   conflictIds={new Set([12345])}
 *   sectionsForSchedule={selectedSections}
 *   isInSchedule={true}
 *   isHidden={false}
 *   onAddCourse={(courseId) => handleAddCourse(courseId)}
 *   onRemoveCourse={(courseId) => handleRemoveCourse(courseId)}
 *   onToggleVisibility={(courseId) => handleToggleVisibility(courseId)}
 * />
 * ```
 *
 * @dependencies
 * - Redux store for layout state management
 * - Framer Motion for animations
 * - Radix UI Collapsible for accordion functionality
 * - Lucide React for icons
 * - Custom hooks for auto-expansion behavior
 *
 * @features
 * - Collapsible accordion interface for course sections
 * - Professor-based grouping with ratings
 * - Conflict detection and highlighting
 * - Automatic expansion for conflict resolution
 * - Smooth scroll to expanded sections
 * - Add/remove entire courses from schedule
 * - Section visibility toggling
 * - Color-coded course identification
 * - Hover effects and transitions
 *
 * @animations
 * - Staggered entrance animations based on course index
 * - Smooth expand/collapse transitions
 * - Hover color adjustments
 * - Conflict state animations
 *
 * @scrollBehavior
 * - Automatic scroll to expanded sections during conflict resolution
 * - Smooth scrolling with viewport management
 * - Retry mechanism for viewport detection
 *
 * @styling
 * - Dynamic background colors based on course
 * - Conflict state ring highlighting
 * - Responsive design
 * - Dark mode support
 * - Backdrop blur effects for buttons
 */
export interface CourseAccordionProps {
  courseId: string;
  professorGroups: Record<
    string,
    { rating: number; sections: SelectedSection[] }
  >;
  courseIndex: number;
  conflictGroupIndex: number;
  positionInGroup: number;
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

// Helper function to find the scroll viewport with retry
const findScrollAreaViewport = (retryCount = 0): HTMLElement | null => {
  // Try both by ID and by data attribute
  const viewport =
    document.getElementById(SCROLL_VIEWPORT_ID) ||
    (document.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLElement | null);

  if (!viewport && retryCount < 5) {
    // Wait a bit and try again
    setTimeout(() => findScrollAreaViewport(retryCount + 1), 100);
    return null;
  }

  return viewport;
};

const CourseAccordion: FC<CourseAccordionProps> = ({
  courseId,
  professorGroups,
  courseIndex,
  conflictGroupIndex,
  positionInGroup,
  conflictIds,
  sectionsForSchedule,
  isInSchedule,
  isHidden,
  onAddCourse,
  onRemoveCourse,
  onToggleVisibility,
}) => {
  const expandTick = useAppSelector(
    (state) => state.layout.expandConflictsTick
  );
  const rowRef = useRef<HTMLDivElement>(null);
  const isConflicted = Object.values(professorGroups)
    .flatMap((g) => g.sections)
    .some((s) => conflictIds.has(s.classNumber));

  // Calculate the total position across all conflict groups
  const totalPosition = conflictGroupIndex * 100 + positionInGroup;

  // Only force open if this is the current position to handle
  const shouldForceOpen = isConflicted && expandTick === totalPosition + 1;

  const [open, setOpen] = useAutoExpand(shouldForceOpen);

  const firstProfKey = Object.keys(professorGroups)[0];
  const bgColor = professorGroups[firstProfKey].sections[0].color || "#ffffff";

  const sectionCount = Object.values(professorGroups).flatMap(
    (g) => g.sections
  ).length;

  useEffect(() => {
    if (shouldForceOpen && rowRef.current) {
      // Add a small delay to ensure the collapsible is open
      const timeoutId = setTimeout(() => {
        const viewport = findScrollAreaViewport();

        if (viewport) {
          const elementRect = rowRef.current!.getBoundingClientRect();
          const viewportRect = viewport.getBoundingClientRect();
          const scrollTop =
            viewport.scrollTop + (elementRect.top - viewportRect.top);

          viewport.scrollTo({
            top: scrollTop,
            behavior: "smooth",
          });
        }
      }, 300);

      // Cleanup function to clear the timeout
      return () => clearTimeout(timeoutId);
    }
  }, [
    shouldForceOpen,
    courseId,
    conflictGroupIndex,
    positionInGroup,
    totalPosition,
    expandTick,
  ]);

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
      ref={rowRef}
    >
      <Collapsible
        className="group/collapsible w-full"
        open={open}
        onOpenChange={setOpen}
      >
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
