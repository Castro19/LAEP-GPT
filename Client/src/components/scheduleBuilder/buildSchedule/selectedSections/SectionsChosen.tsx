import { useAppDispatch, useAppSelector } from "@/redux";
import { SelectedSection } from "@polylink/shared/types";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

import { ChevronRight } from "lucide-react";
import { convertTo12HourFormat } from "@/components/classSearch/helpers/timeFormatter";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { removeSelectedSectionAsync } from "@/redux/sectionSelection/sectionSelectionSlice";
import { useNavigate } from "react-router-dom";
import LabelSection from "@/components/classSearch/reusable/sectionInfo/LabelSection";
import BadgeSection from "@/components/classSearch/reusable/sectionInfo/BadgeSection";

const SectionsChosen = () => {
  const navigate = useNavigate();
  const { selectedSections } = useAppSelector(
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
        className="p-2 text-gray-500 dark:text-gray-400 text-sm"
      >
        The sections you select from the{" "}
        <strong
          className="text-blue-300/80 cursor-pointer"
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
                <div className="bg-white dark:bg-slate-900 rounded-md border border-gray-200 dark:border-slate-700 w-full">
                  <CollapsibleTrigger asChild>
                    <div className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer border-b border-gray-100 dark:border-slate-700 w-full">
                      <div className="flex items-center gap-2 min-w-0">
                        <ChevronRight className="flex-shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-90 text-gray-400 dark:text-gray-500" />
                        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-200 truncate">
                          {courseId}
                        </h2>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-300 flex-shrink-0">
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
                                  <div className="flex justify-between items-center mb-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 px-2 py-1 rounded">
                                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
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
                                        <SectionCard section={section} />
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

const SectionCard: React.FC<{ section: SelectedSection }> = ({ section }) => {
  const dispatch = useAppDispatch();
  const { currentScheduleTerm } = useAppSelector((state) => state.schedule);
  const handleRemove = () => {
    dispatch(
      removeSelectedSectionAsync({
        sectionId: section.classNumber,
        term: currentScheduleTerm,
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
    <div className="border border-gray-200 dark:border-slate-700 rounded-md p-2 bg-transparent transition-colors flex flex-col">
      <div className="space-y-1 flex-1">
        {/* First Row: Format as 'LAB 3500' */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {`${section.component.toUpperCase()} ${section.classNumber}`}
          </span>

          {/* Enrollment Status (Open/Closed/Waitlist) */}
          <span
            className={`text-xxs px-1.5 py-0.5 rounded ${
              section.enrollmentStatus === "O"
                ? "bg-[#204139] text-green-800 dark:bg-[#204139] dark:text-[#5EB752]" // Open
                : section.enrollmentStatus === "W"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" // Waitlist
                  : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" // Closed
            }`}
          >
            {section.enrollmentStatus === "O"
              ? "Open"
              : section.enrollmentStatus === "W"
                ? "Waitlist"
                : "Closed"}
          </span>
        </div>

        {/* Days - Bubble Style */}
        <div className="flex flex-row gap-2 items-center">
          <LabelSection>Days</LabelSection>
          <div className="flex flex-row gap-2">
            {uniqueDays.length > 0 ? (
              uniqueDays.map((day: string) => (
                <BadgeSection key={day} variant="content">
                  {day}
                </BadgeSection>
              ))
            ) : (
              <BadgeSection variant="content">N/A</BadgeSection>
            )}
          </div>
        </div>
        {/* Time & Remove Button - Flexible Layout */}
        <div className="flex flex-col justify-start gap-4">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex flex-row gap-2 items-center">
              <LabelSection>Time</LabelSection>
              <div className="flex flex-row gap-2 items-center">
                <BadgeSection variant="content">{startTime}</BadgeSection>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  to
                </span>
                <BadgeSection variant="content">{endTime}</BadgeSection>
              </div>
            </div>
            {/* Remove Button - Will wrap to new line only when needed */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-xs h-7 px-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 ml-auto"
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionsChosen;
