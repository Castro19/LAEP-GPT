import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, X } from "lucide-react";
import {
  useAppSelector,
  useAppDispatch,
  layoutActions,
  scheduleActions,
  classSearchActions,
} from "@/redux";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateAllScheduleCombinations } from "../../helpers";
import { CourseTerm, Section, SelectedSection } from "@polylink/shared/types";
import { transformSectionToSelectedSection } from "@/helpers/transformSection";
import { environment } from "@/helpers/getEnvironmentVars";

const TimeConflictsPopup = () => {
  const { currentSchedule, preferences, currentScheduleTerm } = useAppSelector(
    (s) => s.schedule
  );
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  /* re-open on a *new* schedule with conflicts ---------------- */
  useEffect(() => {
    setIsOpen(Boolean(currentSchedule?.withConflicts));
  }, [currentSchedule?.id, currentSchedule?.withConflicts]);
  /* ----------------------------------------------------------- */

  const editManually = () => {
    /* … */

    dispatch(layoutActions.fireExpandConflicts()); // <── trigger auto-open
  };

  const autoResolve = async () => {
    const updatedPreferences = {
      ...preferences,
      withTimeConflicts: false,
    };

    const sectionsInSchedule = currentSchedule?.sections as SelectedSection[];

    // 1) Build a map from courseId → color in one pass:
    const courseColorMap = new Map<string, string>(
      sectionsInSchedule.map((s) => [s.courseId, s.color])
    );

    const conflictingCourses =
      currentSchedule?.conflictGroups
        ?.flatMap((group) => group.map((s) => s.courseId))
        .filter((courseId, index, self) => self.indexOf(courseId) === index) ||
      [];

    // 2) Figure out which ones were in conflict, fetch alternates, then
    //    for each alternate section grab its course’s color out of the map:
    let alternateSections: Section[] = [];

    try {
      alternateSections = await dispatch(
        classSearchActions.fetchSectionsByCourseIds({
          courseIds: conflictingCourses as string[],
          term: currentScheduleTerm as CourseTerm,
        })
      ).unwrap();
    } catch (error) {
      if (environment === "dev") {
        console.error("Failed to fetch alternate sections:", error);
      }
    }

    const alternateSelectedSections = alternateSections.map(
      (section: Section) => {
        const color =
          courseColorMap.get(section.courseId) ?? /* fallback */ "#FFFFFF";
        return transformSectionToSelectedSection(section, color);
      }
    );

    const sectionsWithoutConflicts = sectionsInSchedule.filter(
      (s) => !conflictingCourses.includes(s.courseId)
    );

    const allCombinations = generateAllScheduleCombinations(
      [...sectionsWithoutConflicts, ...alternateSelectedSections],
      updatedPreferences
    );

    dispatch(scheduleActions.setSchedules(allCombinations));
    dispatch(scheduleActions.setPage(1));
    dispatch(scheduleActions.setTotalPages(allCombinations.length));

    if (allCombinations.length > 0) {
      dispatch(scheduleActions.setCurrentSchedule(allCombinations[0]));
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="time-conflict-popup" // IMPORTANT
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <Card className="relative w-full max-w-md p-6 bg-secondary border-2 dark:border-zinc-600 border-border rounded-xl shadow-lg flex flex-col gap-4">
            {/* ✕ close button */}
            <button
              aria-label="Close"
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-primary transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-start gap-3">
              <span className="mt-1 text-primary">
                <Info size={22} />
              </span>
              <div>
                <div className="dark:text-zinc-200 font-semibold text-lg leading-tight">
                  Oops! You have conflicting courses in your schedule
                </div>
                <div className="dark:text-zinc-400 text-muted-foreground text-sm mt-1">
                  Choose a different time or let our AI Auto-Resolve find the
                  best fit for you!
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={editManually}
                className="text-muted-foreground underline text-sm font-medium hover:text-primary transition-colors"
              >
                Edit Manually
              </button>
              <Button
                type="button"
                onClick={autoResolve}
                className="dark:bg-blue-100 dark:hover:bg-blue-200 text-primary font-semibold px-5 py-2 rounded-md shadow-sm hover:bg-muted-foreground/80 transition-colors"
              >
                Auto-Resolve
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TimeConflictsPopup;
