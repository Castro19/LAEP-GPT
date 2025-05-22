import { convertTo12HourFormat } from "@/components/classSearch/helpers/timeFormatter";
import BadgeSection from "@/components/classSearch/reusable/sectionInfo/BadgeSection";
import LabelSection from "@/components/classSearch/reusable/sectionInfo/LabelSection";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import {
  useAppDispatch,
  useAppSelector,
  scheduleActions,
  sectionSelectionActions,
} from "@/redux";
import {
  CourseTerm,
  GeneratedSchedule,
  SectionDetail,
  SelectedSection,
} from "@polylink/shared/types";
import { adjustColorBrightness } from "./utils";
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import {
  CalendarMinus,
  CalendarPlus,
  Circle,
  EyeIcon,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTermName } from "@/constants/schedule";
const SectionCard: React.FC<{
  section: SelectedSection;
  isSelected: boolean;
  conflictIds: Set<number>;
}> = ({ section, isSelected, conflictIds }) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { currentScheduleTerm, hiddenSections, currentSchedule } =
    useAppSelector((state) => state.schedule);
  const selectedSectionInList = useAppSelector(
    (state) => state.sectionSelection.selectedSections
  );

  const isHidden = hiddenSections.includes(section.classNumber);
  const isInSchedule =
    currentSchedule?.sections.some(
      (s) => s.classNumber === section.classNumber
    ) ?? false;
  const isConflicted = conflictIds.has(section.classNumber);

  // Check if any other section with same courseId is in schedule
  const hasOtherSectionsInSchedule =
    currentSchedule?.sections.some(
      (s) =>
        s.courseId === section.courseId && s.classNumber !== section.classNumber
    ) ?? false;

  // Check if this section's classPair is in schedule
  const hasClassPairInSchedule = section.classPair
    ? (currentSchedule?.sections.some(
        (s) => s.classNumber === section.classPair
      ) ?? false)
    : false;

  // Only show add button if no other sections are in schedule or if classPair is in schedule
  const canAddToSchedule =
    !hasOtherSectionsInSchedule || hasClassPairInSchedule;

  const handleRemove = () => {
    dispatch(
      sectionSelectionActions.removeSelectedSectionAsync({
        sectionId: section.classNumber,
        term: currentScheduleTerm,
      })
    );
  };

  const handleAddToSelected = () => {
    dispatch(
      sectionSelectionActions.createOrUpdateSelectedSectionAsync({
        section: {
          ...section,
          term: currentScheduleTerm,
        } as unknown as SectionDetail,
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
        sectionIds: [section.classNumber],
        action: "remove",
      })
    );
  };

  const handleAddToCalendar = async () => {
    try {
      // Check if section term matches current schedule term
      if (section.term !== currentScheduleTerm) {
        toast({
          title: `${section.courseId} (${section.classNumber}) is from ${getTermName(section.term as CourseTerm)}.`,
          description: `Please switch to ${getTermName(section.term as CourseTerm)} to add this section.`,
          variant: "destructive",
          action: (
            <ToastAction
              altText="Switch Term"
              className="dark:bg-red dark:border-white border-2"
              onClick={() => {
                dispatch(
                  scheduleActions.setCurrentScheduleTerm(
                    section.term as CourseTerm
                  )
                );
              }}
            >
              Switch Term
            </ToastAction>
          ),
        });
        return;
      }

      // First ensure the section is in selectedSections
      const isSectionNotSelected = !selectedSectionInList.some(
        (s: SelectedSection) => s.classNumber === section.classNumber
      );

      if (isSectionNotSelected) {
        await dispatch(
          sectionSelectionActions.createOrUpdateSelectedSectionAsync({
            section: {
              ...section,
              term: currentScheduleTerm,
            } as unknown as SectionDetail,
          })
        ).unwrap();
      }

      if (!currentSchedule) {
        const currentBlankSchedule: GeneratedSchedule = {
          sections: [],
          customEvents: [],
          name: "New Schedule",
          id: "",
          averageRating: 0,
        };
        dispatch(scheduleActions.setCurrentSchedule(currentBlankSchedule));
      }

      // Now that the section is selected, update the schedule
      await dispatch(
        scheduleActions.updateScheduleSection({
          sectionIds: [section.classNumber],
          action: "add",
        })
      ).unwrap();
    } catch (err) {
      console.error("Failed to add section to calendar:", err);
    }
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

  const isInSelectedSections = selectedSectionInList.some(
    (s: SelectedSection) => s.classNumber === section.classNumber
  );

  return (
    <div
      className={`
          group relative rounded-md p-2 flex flex-col
          border ${isConflicted ? "border-red-500" : "border-gray-200 dark:border-slate-700"}
          ${isConflicted ? "ring-2 ring-red-500/60" : ""}
          bg-transparent
        `}
    >
      {/* subtle red veil */}
      {isConflicted && (
        <div className="absolute inset-0 rounded-md bg-red-500/10 pointer-events-none" />
      )}
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
            {isInSelectedSections ? (
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
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleAddToSelected}
                      className="h-7 w-7 text-gray-900 dark:text-gray-50 
                          hover:bg-gray-200/50 dark:hover:bg-gray-700/50
                          hover:text-gray-950 dark:hover:text-white"
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipPortal>
                    <TooltipContent
                      side="top"
                      sideOffset={5}
                      className="z-[100]"
                      avoidCollisions={true}
                    >
                      Add to selected sections
                    </TooltipContent>
                  </TooltipPortal>
                </Tooltip>
              </TooltipProvider>
            )}
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
          ) : canAddToSchedule ? (
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
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SectionCard;
