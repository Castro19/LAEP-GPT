import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector, classSearchActions } from "@/redux";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye } from "react-icons/fa";
import { toggleHiddenSection } from "@/redux/schedule/scheduleSlice";

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
import { Button } from "@/components/ui/button";

// Hooks
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";
// Helpers
import { formatProfessorNames } from "@/components/scheduleBuilder";
// Types
import { SelectedSection } from "@polylink/shared/types";

type AsyncCoursesProps = {
  sections: SelectedSection[];
  // eslint-disable-next-line no-unused-vars
  onHeightChange?: (height: number) => void;
  isExpanded: boolean;
  // eslint-disable-next-line no-unused-vars
  setIsExpanded: (expanded: boolean) => void;
};

// Add a new component for displaying asynchronous courses
const AsyncCourses: React.FC<AsyncCoursesProps> = ({
  sections,
  onHeightChange,
  isExpanded,
  setIsExpanded,
}) => {
  const isNarrowScreen = useIsNarrowScreen();
  const dispatch = useAppDispatch();
  const { currentScheduleTerm, hiddenSections, currentSchedule } =
    useAppSelector((state) => state.schedule);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter for asynchronous courses
  const asyncSections = sections.filter(
    (section) =>
      (section.meetings.length === 0 ||
        section.meetings.every(
          (meeting) => !meeting.start_time || !meeting.end_time
        )) &&
      !hiddenSections.includes(section.classNumber)
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

  const handleCourseClick = (classNumber: number) => {
    dispatch(
      classSearchActions.fetchSingleSection({
        classNumber: classNumber.toString(),
        term: currentScheduleTerm,
      })
    );
  };

  const handleToggleHidden = (classNumber: number) => {
    dispatch(toggleHiddenSection(classNumber));
  };

  // Update parent component when height changes
  useEffect(() => {
    if (containerRef.current) {
      const updateHeight = () => {
        const _height =
          containerRef.current?.getBoundingClientRect().height || 0;
        if (onHeightChange) {
          onHeightChange(_height);
        }
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
    <motion.div
      ref={containerRef}
      className="w-full mb-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-xs sm:text-sm font-semibold">
          Asynchronous Courses ({asyncSections.length})
        </h3>
        <motion.span
          className="text-xs sm:text-sm"
          animate={{ rotate: isExpanded ? 180 : 0 }}
        >
          {isExpanded ? "▼" : "▶"}
        </motion.span>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="mt-1"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className={`grid gap-1 w-full ${getGridCols()}`}>
              {asyncSections.map((section, index) => {
                const professorNames = formatProfessorNames(section.professors);
                const isHidden = hiddenSections.includes(section.classNumber);
                const isInSchedule =
                  currentSchedule?.sections.some(
                    (s) => s.classNumber === section.classNumber
                  ) ?? false;

                return (
                  <motion.div
                    key={section.classNumber}
                    className="w-full"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.03,
                      ease: "easeOut",
                    }}
                  >
                    <Modal>
                      <CustomModalTriggerButton
                        color={section.color}
                        className="rounded-md hover:opacity-90 transition-opacity cursor-pointer w-full my-2"
                        onClick={() => handleCourseClick(section.classNumber)}
                      >
                        <div className="flex flex-col items-start justify-between p-1 w-full h-full">
                          <div className="flex flex-col items-start justify-center w-full">
                            <div className="flex items-center justify-between w-full">
                              <div className="text-[9px] sm:text-xs text-gray-700 dark:text-gray-700 whitespace-nowrap">
                                Asynchronous
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
                                    handleToggleHidden(section.classNumber);
                                  }}
                                >
                                  <FaEye className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                            <div className="text-xxs sm:text-sm font-bold text-gray-700 dark:text-gray-700 truncate w-full">
                              {section.courseId}
                            </div>
                          </div>
                          <div className="text-[9px] sm:text-xs font-bold text-gray-700 dark:text-gray-700 truncate w-full text-left self-start">
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
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AsyncCourses;
