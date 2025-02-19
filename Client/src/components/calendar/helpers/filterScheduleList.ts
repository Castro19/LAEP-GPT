import { SelectedSection } from "@polylink/shared/types";
import { CalendarPreferencesForm } from "../buildSchedule/CalendarBuilderForm";

function filterSchedules(
  allSchedules: SelectedSection[][],
  preferences: CalendarPreferencesForm
): SelectedSection[][] {
  const filteredSchedules: SelectedSection[][] = [];
  //   Loop thru every schedule and identify which one to keep
  for (const schedule of allSchedules) {
    let unitCount = 0;
    let ratingCount = 0;
    let professorWithRatingCount = 0;
    const seenCourses = new Set<string>();

    for (const section of schedule) {
      if (!seenCourses.has(section.courseId)) {
        seenCourses.add(section.courseId);
        unitCount += Number(section.units);
      } else {
        unitCount += Number(section.units);
        ratingCount += section.rating;
        if (section.rating > 0) {
          professorWithRatingCount++;
        }
      }
    }
    // Check the preferences to see if the schedule fits
    if (preferences.minUnits && unitCount < Number(preferences.minUnits)) {
      continue;
    }
    if (preferences.maxUnits && unitCount > Number(preferences.maxUnits)) {
      continue;
    }
    if (
      preferences.minInstructorRating &&
      ratingCount / professorWithRatingCount <
        Number(preferences.minInstructorRating)
    ) {
      continue;
    }
    if (
      preferences.maxInstructorRating &&
      ratingCount / professorWithRatingCount >
        Number(preferences.maxInstructorRating)
    ) {
      continue;
    }
    filteredSchedules.push(schedule);
  }

  return filteredSchedules;
}

export default filterSchedules;
