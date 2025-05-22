import { SelectedSection } from "@polylink/shared/types";
import { SchedulePreferencesForm } from "../buildSchedule/ScheduleBuilderForm";
import { Schedule } from ".";

function filterSchedules(
  allSchedules: SelectedSection[][],
  preferences: SchedulePreferencesForm
): Schedule[] {
  const filteredSchedules: Schedule[] = [];
  //   Loop thru every schedule and identify which one to keep
  for (const schedule of allSchedules) {
    let unitCount = 0;
    let ratingCount = 0;
    let professorWithRatingCount = 0;
    const seenCourses = new Set<string>();

    for (const section of schedule) {
      const unitList = section.units ? section.units.split(" - ") : [];
      const unitNumber =
        unitList.length > 1
          ? (parseInt(unitList[0]) + parseInt(unitList[1])) / 2
          : parseInt(unitList[0]);
      if (!seenCourses.has(section.courseId)) {
        seenCourses.add(section.courseId);
        unitCount += Number(unitNumber);
        ratingCount += section.rating;

        if (section.rating > 0) {
          professorWithRatingCount++;
        }
      } else {
        unitCount += Number(unitNumber);
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

    const scheduleToAdd: Schedule = {
      sections: schedule.flat(),
      averageRating: ratingCount / professorWithRatingCount,
    };
    filteredSchedules.push(scheduleToAdd);
  }

  return filteredSchedules;
}

export default filterSchedules;
