import {
  useAppDispatch,
  useAppSelector,
  sectionSelectionActions,
  scheduleActions,
} from "@/redux";
import {
  GeneratedSchedule,
  SectionDetail,
  SelectedSection,
  CourseTerm,
} from "@polylink/shared/types";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useMemo } from "react";
import { getTermName } from "@/constants/schedule";
import EmptySelectedSectionts from "./EmptySelectedSectionts";
import SelectOrDeselectAllSections from "./SelectOrDeselectAllSections";
import CourseAccordion from "./CourseAccordion";

const SectionsChosen = ({
  selectedSections = [],
  inChat = false,
}: {
  selectedSections: SelectedSection[];
  inChat?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const { sectionsForSchedule } = useAppSelector(
    (state) => state.sectionSelection
  );
  const { hiddenSections, currentSchedule, currentScheduleTerm } =
    useAppSelector((state) => state.schedule);
  const selectedSectionInList =
    useAppSelector((state) => state.sectionSelection.selectedSections) || [];
  const { toast } = useToast();

  const conflictIds = useMemo(() => {
    if (!currentSchedule?.conflictGroups) return new Set<number>();
    return new Set(
      currentSchedule.conflictGroups.flatMap((group) =>
        group.map((sec) => sec.classNumber)
      )
    );
  }, [currentSchedule?.conflictGroups]);

  // Find which conflict group a course belongs to and its position within that group
  const getConflictGroupInfo = (courseId: string) => {
    if (!currentSchedule?.conflictGroups)
      return { groupIndex: -1, positionInGroup: -1 };

    // Find the conflict group that contains this course
    const groupIndex = currentSchedule.conflictGroups.findIndex((group) =>
      group.some((section) => section.courseId === courseId)
    );

    if (groupIndex === -1) return { groupIndex: -1, positionInGroup: -1 };

    // Find the position of the first section of this course in the conflict group
    const group = currentSchedule.conflictGroups[groupIndex];
    const positionInGroup = group.findIndex(
      (section) => section.courseId === courseId
    );

    return { groupIndex, positionInGroup };
  };

  // Group sections by courseId and professor
  if (
    (selectedSections.length === 0 || !Array.isArray(selectedSections)) &&
    !inChat
  ) {
    return <EmptySelectedSectionts />;
  }

  const groupedSections = selectedSections.reduce(
    (acc, section) => {
      const courseKey = section.courseId;
      const professorKey = section.professors.map((p) => p.name).join(", ");

      if (!acc[courseKey]) {
        acc[courseKey] = {};
      }
      if (!acc[courseKey][professorKey]) {
        acc[courseKey][professorKey] = { rating: section.rating, sections: [] };
      }
      acc[courseKey][professorKey].sections.push(section);
      return acc;
    },
    {} as Record<
      string,
      Record<string, { rating: number; sections: SelectedSection[] }>
    >
  );

  // Check if any section of a course is in the current schedule
  const isCourseInSchedule = (courseId: string) => {
    const sections = getCourseSections(courseId);
    if (!sections || !currentSchedule?.sections) return false;
    return sections.some((section) => {
      return currentSchedule.sections.some(
        (s) => s && s.classNumber === section.classNumber
      );
    });
  };

  // Get all sections for a course
  const getCourseSections = (courseId: string) => {
    return Object.values(groupedSections[courseId]).flatMap(
      (group) => group.sections
    );
  };

  // Handle adding all sections of a course to schedule
  const handleAddCourseToCalendar = async (courseId: string) => {
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
    const sections = getCourseSections(courseId);

    if (!sections || sections.length === 0) return;

    const sectionsToAdd = new Set<number>();

    // Get the first section that's not in the schedule
    const firstAvailableSection = sections.find(
      (section) =>
        section &&
        !currentSchedule?.sections.some(
          (s) => s && s.classNumber === section.classNumber
        )
    );

    if (firstAvailableSection) {
      // If this section has a class pair, add both sections
      if (firstAvailableSection.classPair) {
        const pairedSection = sections.find(
          (s) => s && s.classNumber === firstAvailableSection.classPair
        );
        if (pairedSection) {
          sectionsToAdd.add(pairedSection.classNumber);
        }
      }
      sectionsToAdd.add(firstAvailableSection.classNumber);
    }

    if (sectionsToAdd.size > 0) {
      try {
        // First ensure all sections in sectionsToAdd are in selectedSections
        const toCreate = Array.from(sectionsToAdd)
          .filter(
            (sectionId) =>
              !selectedSectionInList.some((s) => s.classNumber === sectionId)
          )
          .map((sectionId) => {
            const section = sections.find((s) => s.classNumber === sectionId);
            if (!section) return null;
            if (section?.term !== currentScheduleTerm) {
              // throw toast error
              toast({
                title: `${section.courseId} (${section.classNumber}) is from ${getTermName(section?.term as CourseTerm)}.`,
                description: `Please switch to ${getTermName(section?.term as CourseTerm)} to add this section.`,
                variant: "destructive",
                action: (
                  <ToastAction
                    altText="Switch Term"
                    className="dark:bg-red dark:border-white border-2"
                    onClick={() => {
                      dispatch(
                        scheduleActions.setCurrentScheduleTerm(
                          section?.term as CourseTerm
                        )
                      );
                    }}
                  >
                    Switch Term
                  </ToastAction>
                ),
              });
              // Remove the section from sectionsToAdd Set
              sectionsToAdd.delete(sectionId);
              return null;
            }

            return dispatch(
              sectionSelectionActions.createOrUpdateSelectedSectionAsync({
                section: {
                  ...section,
                  term: currentScheduleTerm,
                } as unknown as SectionDetail,
              })
            ).unwrap();
          })
          .filter(Boolean); // Remove any null entries

        // Wait for all section selections to complete
        if (toCreate.length > 0) {
          await Promise.all(toCreate);
        }

        // Now that all sections are selected, update the schedule
        await dispatch(
          scheduleActions.updateScheduleSection({
            sectionIds: Array.from(sectionsToAdd),
            action: "add",
          })
        ).unwrap();
      } catch (err) {
        console.error("Failed to add course to calendar:", err);
      }
    }
  };

  // Handle removing all sections of a course from schedule
  const handleRemoveCourseFromCalendar = (courseId: string) => {
    const sections = getCourseSections(courseId);
    const sectionsToRemove = new Set<number>();

    // Get the first section that's in the schedule
    const firstScheduledSection = sections.find((section) =>
      currentSchedule?.sections.some(
        (s) => s.classNumber === section.classNumber
      )
    );

    if (firstScheduledSection) {
      // If this section has a class pair, remove both sections
      if (firstScheduledSection.classPair) {
        const pairedSection = sections.find(
          (s) => s.classNumber === firstScheduledSection.classPair
        );
        if (pairedSection) {
          sectionsToRemove.add(pairedSection.classNumber);
        }
      }
      sectionsToRemove.add(firstScheduledSection.classNumber);
    }

    // Dispatch once with all sections to remove
    if (sectionsToRemove.size > 0) {
      dispatch(
        scheduleActions.updateScheduleSection({
          sectionIds: Array.from(sectionsToRemove),
          action: "remove",
        })
      );
    }
  };

  // Check if any section of a course is hidden
  const isCourseHidden = (courseId: string) => {
    const sections = Object.values(groupedSections[courseId]).flatMap(
      (group) => group.sections
    );
    return sections.some((section) =>
      hiddenSections.includes(section.classNumber)
    );
  };

  // Toggle visibility for all sections of a course
  const handleToggleCourseVisibility = (courseId: string) => {
    const sections = Object.values(groupedSections[courseId]).flatMap(
      (group) => group.sections
    );
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
      {!inChat && <SelectOrDeselectAllSections />}
      <AnimatePresence mode="wait">
        {Object.entries(groupedSections).map(
          ([courseId, professorGroups], courseIndex) => {
            const { groupIndex, positionInGroup } =
              getConflictGroupInfo(courseId);
            return (
              <CourseAccordion
                key={courseId}
                courseId={courseId}
                professorGroups={professorGroups}
                courseIndex={courseIndex}
                conflictGroupIndex={groupIndex}
                positionInGroup={positionInGroup}
                conflictIds={conflictIds}
                sectionsForSchedule={sectionsForSchedule}
                isInSchedule={isCourseInSchedule(courseId)}
                isHidden={isCourseHidden(courseId)}
                onAddCourse={handleAddCourseToCalendar}
                onRemoveCourse={handleRemoveCourseFromCalendar}
                onToggleVisibility={handleToggleCourseVisibility}
              />
            );
          }
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SectionsChosen;
