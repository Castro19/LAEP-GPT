import React, { useState, useEffect, useRef } from "react";
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

interface AsyncCoursesProps {
  sections: SelectedSection[];
  onHeightChange: (height: number) => void;
}

// Add a new component for displaying asynchronous courses
const AsyncCourses: React.FC<AsyncCoursesProps> = ({
  sections,
  onHeightChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const isNarrowScreen = useIsNarrowScreen();
  const dispatch = useAppDispatch();
  const { currentScheduleTerm } = useAppSelector((state) => state.schedule);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter for asynchronous courses
  const asyncSections = sections.filter(
    (section) =>
      section.meetings.length === 0 ||
      section.meetings.every(
        (meeting) => !meeting.start_time || !meeting.end_time
      )
  );

  // Determine the optimal number of columns based on the number of async sections
  const getGridCols = () => {
    // Calculate the optimal number of columns based on the number of sections
    // This ensures each section takes up 1/{sections.length} of the width when possible
    if (asyncSections.length <= 1) return "grid-cols-1";
    if (asyncSections.length === 2) return "grid-cols-2";
    if (asyncSections.length === 3) return "grid-cols-3";
    if (asyncSections.length === 4) return "grid-cols-4";
    if (asyncSections.length === 5) return "grid-cols-5";
    if (asyncSections.length === 6) return "grid-cols-6";

    // For more than 6 sections, use responsive breakpoints
    return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";
  };

  const handleCourseClick = (classNumber: string) => {
    dispatch(
      classSearchActions.fetchSingleSection({
        classNumber,
        term: currentScheduleTerm,
      })
    );
  };

  // Update parent component when height changes
  useEffect(() => {
    if (containerRef.current) {
      const updateHeight = () => {
        const height =
          containerRef.current?.getBoundingClientRect().height || 0;
        onHeightChange(height);
      };

      updateHeight();

      // Create a ResizeObserver to detect container size changes
      const resizeObserver = new ResizeObserver(updateHeight);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [onHeightChange, isExpanded, asyncSections.length]);

  if (asyncSections.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="w-full mb-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700"
    >
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-xs font-semibold">
          Asynchronous Courses ({asyncSections.length})
        </h3>
        <span className="text-xs">{isExpanded ? "▼" : "▶"}</span>
      </div>

      {isExpanded && (
        <div className="mt-1">
          <div className={`grid gap-1 w-full ${getGridCols()}`}>
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
                      <div className="flex flex-col items-start justify-between p-1 w-full h-full">
                        <div className="flex flex-col items-start justify-center w-full">
                          <div className="text-[9px] text-gray-700 dark:text-gray-700 whitespace-nowrap">
                            Asynchronous
                          </div>
                          <div className="text-xxs font-bold text-gray-700 dark:text-gray-700 truncate w-full">
                            {section.courseId}
                          </div>
                        </div>
                        <div className="text-[9px] font-bold text-gray-700 dark:text-gray-700 truncate w-full text-right self-end">
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
