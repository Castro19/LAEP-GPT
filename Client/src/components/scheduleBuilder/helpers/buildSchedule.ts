import { SelectedSection } from "@polylink/shared/types";
import {
  generateAllScheduleCombinations,
  generateScheduleWithConflicts,
} from ".";
import { SchedulePreferencesForm } from "../buildSchedule/ScheduleBuilderForm";

const buildSchedule = (
  selectedSections: SelectedSection[],
  preferences: SchedulePreferencesForm
) => {
  let sections = selectedSections;
  if (preferences.openOnly) {
    sections = selectedSections.filter(
      (section) => section.enrollmentStatus === "O"
    );
  }
  if (preferences.showOverlappingClasses) {
    const scheduleWithConflicts = generateScheduleWithConflicts(
      sections,
      preferences
    );
    return scheduleWithConflicts;
  } else {
    const allSchedules = generateAllScheduleCombinations(sections, preferences);
    return allSchedules;
  }
};

export default buildSchedule;
