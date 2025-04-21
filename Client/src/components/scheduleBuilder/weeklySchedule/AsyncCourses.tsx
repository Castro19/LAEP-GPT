import { useState } from "react";
import { useAppDispatch, useAppSelector, classSearchActions } from "@/redux";

// Components
import NarrowScreenScheduleSectionInfo from "./NarrowScreenScheduleSectionInfo";
import ScheduleSectionInfo from "./ScheduleSectionInfo";
// UI Components
import {
  Modal,
  ModalContent,
  NarrowScreenModal,
} from "@/components/ui/animated-modal";
import {
  CustomModalBody,
  CustomModalTriggerButton,
} from "@/components/ui/animated-modal";

// Hooks
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";
// Helpers
import { formatProfessorNames } from "@/components/scheduleBuilder";
// Types
import { SelectedSection } from "@polylink/shared/types";

// Add a new component for displaying asynchronous courses
const AsyncCourses: React.FC<{ sections: SelectedSection[] }> = ({
  sections,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const isNarrowScreen = useIsNarrowScreen();
  const dispatch = useAppDispatch();
  const { currentScheduleTerm } = useAppSelector((state) => state.schedule);

  // Filter for asynchronous courses
  const asyncSections = sections.filter(
    (section) =>
      section.meetings.length === 0 ||
      section.meetings.every(
        (meeting) => !meeting.start_time || !meeting.end_time
      )
  );

  if (asyncSections.length === 0) {
    return null;
  }

  // Determine the optimal number of columns based on the number of async sections
  const getGridCols = () => {
    if (asyncSections.length <= 1) return "grid-cols-1";
    if (asyncSections.length <= 2) return "grid-cols-1 sm:grid-cols-2";
    if (asyncSections.length <= 3)
      return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
    if (asyncSections.length <= 4)
      return "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4";
    return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
  };

  const handleCourseClick = (classNumber: string) => {
    dispatch(
      classSearchActions.fetchSingleSection({
        classNumber,
        term: currentScheduleTerm,
      })
    );
  };

  return (
    <div className="w-full mb-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-sm font-semibold">
          Asynchronous Courses ({asyncSections.length})
        </h3>
        <span className="text-xs">{isExpanded ? "▼" : "▶"}</span>
      </div>

      {isExpanded && (
        <div className="mt-2">
          <div className={`grid gap-2 w-full ${getGridCols()}`}>
            {asyncSections.map((section) => {
              const professorNames = formatProfessorNames(section.professors);

              return (
                <div key={section.classNumber} className="w-full">
                  <Modal>
                    <CustomModalTriggerButton
                      color={section.color}
                      className="rounded-md hover:opacity-90 transition-opacity cursor-pointer w-full"
                      onClick={() =>
                        handleCourseClick(section.classNumber.toString())
                      }
                    >
                      <div className="flex flex-col items-start justify-center p-1 sm:p-2 w-full">
                        <div className="text-[10px] sm:text-xs text-gray-700 dark:text-gray-700 whitespace-nowrap">
                          Asynchronous
                        </div>
                        <div className="text-xxs sm:text-sm font-bold text-gray-700 dark:text-gray-700 truncate w-full">
                          {section.courseId}
                        </div>
                        <div className="text-[10px] sm:text-xs font-bold text-gray-700 dark:text-gray-700 truncate w-full">
                          {professorNames}
                        </div>
                      </div>
                    </CustomModalTriggerButton>
                    {isNarrowScreen ? (
                      <NarrowScreenModal>
                        <NarrowScreenScheduleSectionInfo />
                      </NarrowScreenModal>
                    ) : (
                      <CustomModalBody>
                        <ModalContent className="dark:bg-slate-950">
                          <ScheduleSectionInfo />
                        </ModalContent>
                      </CustomModalBody>
                    )}
                  </Modal>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AsyncCourses;
