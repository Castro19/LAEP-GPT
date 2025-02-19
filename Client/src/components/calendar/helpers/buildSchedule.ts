import { SelectedSection } from "@polylink/shared/types";
import {
  generateAllScheduleCombinations,
  generateScheduleWithConflicts,
} from ".";
import { CalendarPreferencesForm } from "../buildSchedule/CalendarBuilderForm";

const buildSchedule = (
  selectedSections: SelectedSection[],
  preferences: CalendarPreferencesForm
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
