import {
  useAppDispatch,
  useAppSelector,
  sectionSelectionActions,
  scheduleActions,
} from "@/redux";
import { SelectedSection } from "@polylink/shared/types";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  EyeIcon,
  CalendarMinus,
  Trash2,
  ChevronRight,
  CheckCircle,
  Circle,
  CalendarPlus,
} from "lucide-react";
import { convertTo12HourFormat } from "@/components/classSearch/helpers/timeFormatter";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { useNavigate } from "react-router-dom";
import LabelSection from "@/components/classSearch/reusable/sectionInfo/LabelSection";
import BadgeSection from "@/components/classSearch/reusable/sectionInfo/BadgeSection";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipPortal,
} from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";

const SectionsChosen = ({
  selectedSections,
  inChat = false,
}: {
  selectedSections: SelectedSection[];
  inChat?: boolean;
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { sectionsForSchedule } = useAppSelector(
    (state) => state.sectionSelection
  );
  const { hiddenSections, currentSchedule } = useAppSelector(
    (state) => state.schedule
  );

  // Group sections by courseId and professor
  if (
    (selectedSections.length === 0 || !Array.isArray(selectedSections)) &&
    !inChat
  ) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.1,
        }}
        className="p-2 text-gray-700 dark:text-gray-800 text-sm"
      >
        The sections you select from the{" "}
        <strong
          className="text-blue-600/80 dark:text-blue-800 cursor-pointer"
          onClick={() => navigate("/class-search")}
        >
          Class Search
        </strong>{" "}
        page will appear here
      </motion.div>
    );
  }

  const groupedSections = selectedSections.reduce(
    (acc, section) => {
      const courseKey = section.courseId;
      const professorKey = section.professors.map((p) => p.name).join(", ");

      if (!acc[courseKey]) {
        acc[courseKey] = {};
      }
      if (!acc[courseKey][professorKey]) {
        acc[courseKey][professorKey] = [];
      }
      acc[courseKey][professorKey].push(section);
      return acc;
    },
    {} as Record<string, Record<string, SelectedSection[]>>
  );

  // Handle select all sections
  const handleSelectAll = () => {
    dispatch(sectionSelectionActions.selectAllSectionsForSchedule());
  };

  // Handle deselect all sections
  const handleDeselectAll = () => {
    dispatch(sectionSelectionActions.deselectAllSectionsForSchedule());
  };

  // Check if any section of a course is in the current schedule
  const isCourseInSchedule = (courseId: string) => {
    return Object.values(groupedSections[courseId])
      .flat()
      .some((section) =>
        currentSchedule?.sections.some(
          (s) => s.classNumber === section.classNumber
        )
      );
  };

  // Check if any section of a course is hidden
  const isCourseHidden = (courseId: string) => {
    const sections = Object.values(groupedSections[courseId]).flat();
    return sections.some((section) =>
      hiddenSections.includes(section.classNumber)
    );
  };

  // Toggle visibility for all sections of a course
  const handleToggleCourseVisibility = (courseId: string) => {
    const sections = Object.values(groupedSections[courseId]).flat();
    const anyHidden = sections.some((section) =>
      hiddenSections.includes(section.classNumber)
    );

    sections.forEach((section) => {
      if (anyHidden) {
        // If any section is hidden, show all sections
        if (hiddenSections.includes(section.classNumber)) {
          dispatch(scheduleActions.toggleHiddenSection(section.classNumber));
        }
      } else {
        // If no sections are hidden, hide all sections
        if (!hiddenSections.includes(section.classNumber)) {
          dispatch(scheduleActions.toggleHiddenSection(section.classNumber));
        }
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.1,
      }}
      className="grid grid-cols-1 gap-2 w-full overflow-hidden"
    >
      {!inChat && (
        <>
          {/* Header with select/deselect all buttons */}
          <div className="flex flex-wrap justify-between items-center gap-2 mb-2 px-2">
            <div className="text-xs font-medium text-slate-700 dark:text-gray-200 min-w-[120px]">
              Select sections to include in schedule:
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="text-xs h-7 px-3"
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeselectAll}
                className="text-xs h-7 px-3"
              >
                Deselect All
              </Button>
            </div>
          </div>
        </>
      )}

      <AnimatePresence mode="wait">
        {Object.entries(groupedSections).map(
          ([courseId, professorGroups], courseIndex) => {
            const isInSchedule = isCourseInSchedule(courseId);
            const isHidden = isCourseHidden(courseId);

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
                    className="rounded-md border border-gray-200 dark:border-slate-700 w-full"
                    style={{
                      backgroundColor:
                        professorGroups[Object.keys(professorGroups)[0]][0]
                          .color || "#ffffff",
                      borderColor:
                        professorGroups[Object.keys(professorGroups)[0]][0]
                          .color || "#e5e7eb",
                    }}
                  >
                    <CollapsibleTrigger asChild>
                      <div
                        className="flex justify-between items-center p-3 transition-colors cursor-pointer border-b border-gray-100 dark:border-slate-700 w-full"
                        style={{
                          backgroundColor:
                            professorGroups[Object.keys(professorGroups)[0]][0]
                              .color || "#ffffff",
                        }}
                        onMouseOver={(e) => {
                          const target = e.currentTarget;
                          const currentColor =
                            professorGroups[Object.keys(professorGroups)[0]][0]
                              .color || "#ffffff";
                          // Create a more subtle darker version of the color
                          const darkerColor = adjustColorBrightness(
                            currentColor,
                            -5
                          );
                          target.style.backgroundColor = darkerColor;
                        }}
                        onMouseOut={(e) => {
                          const target = e.currentTarget;
                          const currentColor =
                            professorGroups[Object.keys(professorGroups)[0]][0]
                              .color || "#ffffff";
                          target.style.backgroundColor = currentColor;
                        }}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <ChevronRight className="flex-shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-90 text-gray-700 dark:text-gray-800" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2">
                              <h2 className="text-base font-semibold text-slate-800 dark:text-slate-900 flex-shrink-0">
                                {courseId}
                              </h2>
                              {(() => {
                                const sectionCount =
                                  Object.values(professorGroups).flat().length;
                                return (
                                  <span className="text-xs text-slate-500 dark:text-slate-600 truncate min-w-0">
                                    {sectionCount} section
                                    {sectionCount > 1 ? "s" : ""}
                                  </span>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                        {isInSchedule && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-6 w-6 text-gray-700 dark:text-gray-700 dark:hover:text-gray-800 dark:hover:bg-transparent ${
                              isHidden ? "opacity-50" : ""
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleCourseVisibility(courseId);
                            }}
                          >
                            <EyeIcon className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="px-3 pb-3 ">
                        {Object.entries(professorGroups).map(
                          ([professor, sections], professorIndex) => (
                            <motion.div
                              key={professor}
                              initial={{ opacity: 0, y: 3 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.3,
                                delay:
                                  0.15 +
                                  courseIndex * 0.03 +
                                  professorIndex * 0.02,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                            >
                              <Collapsible
                                defaultOpen
                                className="group/collapsible"
                              >
                                <div className=" border-gray-100 dark:border-slate-700 pt-2">
                                  <CollapsibleTrigger asChild>
                                    <div
                                      className="flex justify-between items-center mb-2 cursor-pointer px-2 py-1 rounded transition-colors"
                                      style={{
                                        backgroundColor: "transparent",
                                      }}
                                      onMouseOver={(e) => {
                                        const target = e.currentTarget;
                                        const currentColor =
                                          professorGroups[
                                            Object.keys(professorGroups)[0]
                                          ][0].color || "#ffffff";
                                        // Create a more subtle darker version of the color
                                        const darkerColor =
                                          adjustColorBrightness(
                                            currentColor,
                                            -5
                                          );
                                        target.style.backgroundColor =
                                          darkerColor;
                                      }}
                                      onMouseOut={(e) => {
                                        const target = e.currentTarget;
                                        target.style.backgroundColor =
                                          "transparent";
                                      }}
                                    >
                                      <h3 className="text-sm font-medium text-slate-700 dark:text-gray-800">
                                        {professor
                                          .split(" ")
                                          .map(
                                            (name) =>
                                              name.charAt(0).toUpperCase() +
                                              name.slice(1).toLowerCase()
                                          )
                                          .join(" ")}
                                      </h3>
                                    </div>
                                  </CollapsibleTrigger>

                                  <CollapsibleContent>
                                    <div className="grid grid-cols-1 gap-1.5">
                                      {sections.map((section, sectionIndex) => (
                                        <motion.div
                                          key={section.classNumber}
                                          initial={{ opacity: 0, y: 3 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{
                                            duration: 0.3,
                                            delay:
                                              0.2 +
                                              courseIndex * 0.03 +
                                              professorIndex * 0.02 +
                                              sectionIndex * 0.01,
                                            ease: [0.22, 1, 0.36, 1],
                                          }}
                                        >
                                          <SectionCard
                                            section={section}
                                            isSelected={
                                              Array.isArray(
                                                sectionsForSchedule
                                              ) &&
                                              sectionsForSchedule.some(
                                                (s) =>
                                                  s.classNumber ===
                                                  section.classNumber
                                              )
                                            }
                                          />
                                        </motion.div>
                                      ))}
                                    </div>
                                  </CollapsibleContent>
                                </div>
                              </Collapsible>
                            </motion.div>
                          )
                        )}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              </motion.div>
            );
          }
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const SectionCard: React.FC<{
  section: SelectedSection;
  isSelected: boolean;
}> = ({ section, isSelected }) => {
  const dispatch = useAppDispatch();
  const { currentScheduleTerm, hiddenSections, currentSchedule } =
    useAppSelector((state) => state.schedule);
  const isHidden = hiddenSections.includes(section.classNumber);
  const isInSchedule =
    currentSchedule?.sections.some(
      (s) => s.classNumber === section.classNumber
    ) ?? false;

  const handleRemove = () => {
    dispatch(
      sectionSelectionActions.removeSelectedSectionAsync({
        sectionId: section.classNumber,
        term: currentScheduleTerm,
      })
    );
  };

  const handleToggleSelection = () => {
    dispatch(
      sectionSelectionActions.toggleSectionForSchedule(section.classNumber)
    );
  };

  const handleToggleHidden = () => {
    dispatch(scheduleActions.toggleHiddenSection(section.classNumber));
  };

  const handleRemoveFromCalendar = () => {
    dispatch(
      scheduleActions.updateScheduleSection({
        sectionId: section.classNumber,
        action: "remove",
      })
    );
  };

  const handleAddToCalendar = () => {
    dispatch(
      scheduleActions.updateScheduleSection({
        sectionId: section.classNumber,
        action: "add",
      })
    );
  };

  // Extract and format start & end time
  const { meetings } = section;
  const startTime = meetings?.[0]?.start_time
    ? convertTo12HourFormat(meetings[0].start_time)
    : "N/A";
  const endTime = meetings?.[0]?.end_time
    ? convertTo12HourFormat(meetings[0].end_time)
    : "N/A";

  // Remove any duplicate days
  const days = meetings.map((meeting) => meeting.days).flat();
  const uniqueDays = [...new Set(days)];

  return (
    <div
      className="
        group relative 
        border border-gray-200 dark:border-slate-700 
        rounded-md p-2 
        flex flex-col bg-transparent
      "
    >
      {/* Content of the card */}
      <div className="space-y-1 flex-1">
        {/* First Row: Format as 'LAB 3500' with checkbox on the right */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-700 dark:text-gray-800">
              {`${section.component.toUpperCase()} ${section.classNumber}`}
            </span>

            {/* Enrollment Status (Open/Closed/Waitlist) */}
            <span
              className={`text-xxs px-1.5 py-0.5 rounded ${
                section.enrollmentStatus === "O"
                  ? "dark:bg-black/80 text-green-400 bg-white/80 dark:text-green-400" // Open
                  : section.enrollmentStatus === "W"
                    ? "dark:bg-black/80 text-yellow-400 bg-white/80 dark:text-yellow-400" // Waitlist
                    : "dark:bg-black/80 text-red-400 bg-white/80 dark:text-red-400" // Closed
              }`}
            >
              {section.enrollmentStatus === "O"
                ? "Open"
                : section.enrollmentStatus === "W"
                  ? "Waitlist"
                  : "Closed"}
            </span>
          </div>
        </div>

        {/* Days - Bubble Style */}
        <div className="flex flex-row gap-2 items-center">
          <LabelSection className="text-gray-700 dark:text-gray-800">
            Days
          </LabelSection>
          <div className="flex flex-row gap-2">
            {uniqueDays.length > 0 ? (
              uniqueDays.map((day: string) => (
                <BadgeSection key={day} variant="selected">
                  {day}
                </BadgeSection>
              ))
            ) : (
              <BadgeSection variant="selected">N/A</BadgeSection>
            )}
          </div>
        </div>

        {/* Time */}
        <div className="flex flex-row gap-2 items-center">
          <LabelSection className="text-gray-700 dark:text-gray-800">
            Time
          </LabelSection>
          <div className="flex flex-row gap-2 items-center">
            <BadgeSection variant="selected">{startTime}</BadgeSection>
            <span className="text-xs text-gray-700 dark:text-gray-800">to</span>
            <BadgeSection variant="selected">{endTime}</BadgeSection>
          </div>
        </div>
      </div>

      {/* Hover toolbar */}
      <div
        className="
          absolute top-2 right-2
          flex items-center gap-3
          opacity-0 translate-x-2
          group-hover:opacity-100 group-hover:translate-x-0
          transition-all duration-200 ease-out
          pointer-events-none
          rounded-md
          p-1
          shadow-sm
          backdrop-blur-sm
          z-50
        "
        style={{
          backgroundColor: adjustColorBrightness(
            section.color || "#ffffff",
            -75
          ),
        }}
      >
        {/* Enable pointer events only when visible */}
        <div className="group-hover:pointer-events-auto flex items-center gap-3">
          {/* Selection Actions Group */}
          <div className="flex items-center gap-1">
            {/* Include in schedule */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Toggle
                    pressed={isSelected}
                    onPressedChange={handleToggleSelection}
                    className={`
                      h-7 w-7 p-0
                      ${
                        isSelected
                          ? "text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300"
                          : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                      }
                      hover:bg-gray-100 dark:hover:bg-gray-800/50
                    `}
                    aria-label={
                      isSelected
                        ? "Remove from schedule generation"
                        : "Include in schedule generation"
                    }
                  >
                    {isSelected ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </Toggle>
                </TooltipTrigger>
                <TooltipPortal>
                  <TooltipContent
                    side="top"
                    sideOffset={5}
                    className="z-[100]"
                    avoidCollisions={true}
                  >
                    {isSelected
                      ? "Remove from schedule generation"
                      : "Include in schedule generation"}
                  </TooltipContent>
                </TooltipPortal>
              </Tooltip>
            </TooltipProvider>

            {/* Remove from selected */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemove}
                    className="h-7 w-7 text-red-700 dark:text-red-400 
                      hover:bg-red-100/50 dark:hover:bg-red-900/50
                      hover:text-red-800 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipPortal>
                  <TooltipContent
                    side="top"
                    sideOffset={5}
                    className="z-[100]"
                    avoidCollisions={true}
                  >
                    Remove from selected sections
                  </TooltipContent>
                </TooltipPortal>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Schedule Actions Group */}
          {isInSchedule ? (
            <div className="flex items-center gap-1">
              {/* Hide/Show */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleToggleHidden}
                      className={`h-7 w-7 text-gray-900 dark:text-gray-50 
                        hover:bg-gray-200/50 dark:hover:bg-gray-700/50
                        hover:text-gray-950 dark:hover:text-white 
                        ${isHidden ? "opacity-50" : ""}`}
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipPortal>
                    <TooltipContent
                      side="top"
                      sideOffset={5}
                      className="z-[100]"
                      avoidCollisions={true}
                    >
                      {isHidden ? "Show in calendar" : "Hide from calendar"}
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
                      onClick={handleRemoveFromCalendar}
                      className="h-7 w-7 text-orange-700 dark:text-orange-400 
                        hover:bg-orange-100/50 dark:hover:bg-orange-900/50
                        hover:text-orange-800 dark:hover:text-orange-300"
                    >
                      <CalendarMinus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipPortal>
                    <TooltipContent
                      side="top"
                      sideOffset={5}
                      className="z-[100]"
                      avoidCollisions={true}
                    >
                      Remove from calendar
                    </TooltipContent>
                  </TooltipPortal>
                </Tooltip>
              </TooltipProvider>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              {/* Add to calendar */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleAddToCalendar}
                      className="h-7 w-7 text-green-700 dark:text-green-400 
                        hover:bg-green-100/50 dark:hover:bg-green-900/50
                        hover:text-green-800 dark:hover:text-green-300"
                    >
                      <CalendarPlus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipPortal>
                    <TooltipContent
                      side="top"
                      sideOffset={5}
                      className="z-[100]"
                      avoidCollisions={true}
                    >
                      Add to calendar
                    </TooltipContent>
                  </TooltipPortal>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to adjust color brightness
const adjustColorBrightness = (hex: string, percent: number): string => {
  // Convert hex to RGB
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  // Adjust brightness
  r = Math.max(0, Math.min(255, r + (r * percent) / 100));
  g = Math.max(0, Math.min(255, g + (g * percent) / 100));
  b = Math.max(0, Math.min(255, b + (b * percent) / 100));

  // Convert back to hex
  const rHex = Math.round(r).toString(16).padStart(2, "0");
  const gHex = Math.round(g).toString(16).padStart(2, "0");
  const bHex = Math.round(b).toString(16).padStart(2, "0");

  return `#${rHex}${gHex}${bHex}`;
};

export default SectionsChosen;
