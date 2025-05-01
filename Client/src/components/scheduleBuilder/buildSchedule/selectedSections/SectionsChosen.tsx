import { useAppDispatch, useAppSelector } from "@/redux";
import { SelectedSection } from "@polylink/shared/types";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { FaEye } from "react-icons/fa";

import { ChevronRight } from "lucide-react";
import { convertTo12HourFormat } from "@/components/classSearch/helpers/timeFormatter";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import {
  removeSelectedSectionAsync,
  toggleSectionForSchedule,
  selectAllSectionsForSchedule,
  deselectAllSectionsForSchedule,
} from "@/redux/sectionSelection/sectionSelectionSlice";
import { useNavigate } from "react-router-dom";
import LabelSection from "@/components/classSearch/reusable/sectionInfo/LabelSection";
import BadgeSection from "@/components/classSearch/reusable/sectionInfo/BadgeSection";
import { toggleHiddenSection } from "@/redux/schedule/scheduleSlice";

const SectionsChosen = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedSections, sectionsForSchedule } = useAppSelector(
    (state) => state.sectionSelection
  );

  // Group sections by courseId and professor
  if (selectedSections.length === 0 || !Array.isArray(selectedSections)) {
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
    dispatch(selectAllSectionsForSchedule());
  };

  // Handle deselect all sections
  const handleDeselectAll = () => {
    dispatch(deselectAllSectionsForSchedule());
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
      {/* Header with select/deselect all buttons */}
      <div className="flex justify-between items-center mb-2 px-2">
        <div className="text-sm font-medium text-slate-700 dark:text-gray-200">
          Select sections to include in schedule:
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="text-xs"
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeselectAll}
            className="text-xs"
          >
            Deselect All
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {Object.entries(groupedSections).map(
          ([courseId, professorGroups], courseIndex) => (
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
                        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-900 truncate">
                          {courseId}
                        </h2>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-gray-200/80 text-gray-800 dark:bg-gray-300/80 dark:text-gray-900 flex-shrink-0">
                          {Object.values(professorGroups).flat().length}{" "}
                          sections
                        </span>
                      </div>
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
                                      const darkerColor = adjustColorBrightness(
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
          )
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
      removeSelectedSectionAsync({
        sectionId: section.classNumber,
        term: currentScheduleTerm,
      })
    );
  };

  const handleToggleSelection = () => {
    dispatch(toggleSectionForSchedule(section.classNumber));
  };

  const handleToggleHidden = () => {
    dispatch(toggleHiddenSection(section.classNumber));
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
    <div className="border border-gray-200 dark:border-slate-700 rounded-md p-2 bg-transparent transition-colors flex flex-col">
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

          {/* Checkbox and Eye Icon */}
          <div className="flex items-center gap-2">
            {isInSchedule && (
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 text-gray-700 dark:text-gray-700 dark:hover:text-gray-800 dark:hover:bg-transparent ${
                  isHidden ? "opacity-50" : ""
                }`}
                onClick={handleToggleHidden}
              >
                <FaEye className="h-3 w-3" />
              </Button>
            )}
            <Checkbox
              id={`section-${section.classNumber}`}
              checked={isSelected}
              onCheckedChange={handleToggleSelection}
              className="h-4 w-4 border-gray-700 dark:border-slate-900"
            />
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
        {/* Time & Remove Button - Flexible Layout */}
        <div className="flex flex-col justify-start gap-4">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex flex-row gap-2 items-center">
              <LabelSection className="text-gray-700 dark:text-gray-800">
                Time
              </LabelSection>
              <div className="flex flex-row gap-2 items-center">
                <BadgeSection variant="selected">{startTime}</BadgeSection>
                <span className="text-xs text-gray-700 dark:text-gray-800">
                  to
                </span>
                <BadgeSection variant="selected">{endTime}</BadgeSection>
              </div>
            </div>
            {/* Remove Button - Will wrap to new line only when needed */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-xs h-7 px-2 text-red-600 hover:text-red-800 dark:text-red-700 dark:hover:text-red-900 ml-auto transition-colors"
              style={{
                backgroundColor: "transparent",
              }}
              onMouseOver={(e) => {
                const target = e.currentTarget;
                const currentColor = section.color || "#ffffff";
                // Create a more subtle darker version of the color
                const darkerColor = adjustColorBrightness(currentColor, -5);
                target.style.backgroundColor = darkerColor;
              }}
              onMouseOut={(e) => {
                const target = e.currentTarget;
                target.style.backgroundColor = "transparent";
              }}
            >
              Remove
            </Button>
          </div>
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
