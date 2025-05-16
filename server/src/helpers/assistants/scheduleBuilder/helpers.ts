import {
  bulkPostSelectedSections,
  getColorForCourseId,
  getSelectedSectionsByUserId,
} from "../../../db/models/selectedSection/selectedSectionServices";

import {
  CourseTerm,
  Course,
  Term,
  Meeting,
  Section,
  SelectedSection,
  ScheduleResponse,
} from "@polylink/shared/types";
import { fetchPrimaryFlowchart } from "../../../db/models/flowchart/flowchartServices";
import {
  getSectionsByCourseIds,
  getSectionsByIds,
} from "../../../db/models/section/sectionServices";
import {
  createOrUpdateSchedule,
  getScheduleById,
} from "../../../db/models/schedule/scheduleServices";
import * as summerSectionCollection from "../../../db/models/section/summerSectionCollection";
import * as sectionCollection from "../../../db/models/section/sectionCollection";
import * as fallSectionCollection from "../../../db/models/section/fallSectionCollection";

export const getSelectedSectionsTool = async ({
  userId,
  term,
}: {
  userId: string;
  term: CourseTerm;
}): Promise<SelectedSection[]> => {
  const selectedSections = await getSelectedSectionsByUserId(
    userId,
    term as CourseTerm
  );

  return selectedSections;
};

export const getUserNextEligibleSections = async ({
  userId,
  term,
  numCourses,
  sectionsPerCourse,
}: {
  userId: string;
  term: CourseTerm;
  numCourses: number;
  sectionsPerCourse: number;
}): Promise<SelectedSection[]> => {
  const flowchart = await fetchPrimaryFlowchart(userId);

  // Sort terms by tIndex
  const terms = (flowchart.termData || []).sort(
    (a: Term, b: Term) => a.tIndex - b.tIndex
  );
  const eligibleCourses: Course[] = [];

  // Iterate through terms and courses
  for (const term of terms) {
    for (const course of term.courses || []) {
      if (course.id && !course.completed) {
        eligibleCourses.push(course);
      }
    }
    // If we have enough courses, break
    if (eligibleCourses.length >= numCourses) {
      break;
    }
  }

  if (eligibleCourses.length === 0) {
    return [];
  }

  // Take only the number of courses we need
  const coursesToProcess = eligibleCourses.slice(0, numCourses);

  // Get all course IDs that are not null
  const courseIds = coursesToProcess
    .map((course) => course.id)
    .filter((id): id is string => id !== null);

  // Get sections for all courses at once
  const sections = await getSectionsByCourseIds(courseIds, term, userId);
  const fetchedSelectedSections = await getSelectedSectionsByUserId(
    userId,
    term as CourseTerm
  );
  if (!sections) {
    return [];
  }
  // Convert sections to SelectedSection format
  const fetchedSections: SelectedSection[] = sections.map((section) =>
    transformSectionToSelectedSection(section, fetchedSelectedSections)
  );

  //   Group by course id and only take sectionsPerCourse sections per course
  const groupedSections = fetchedSections.reduce(
    (acc, section) => {
      acc[section.courseId] = [...(acc[section.courseId] || []), section];
      return acc;
    },
    {} as Record<string, SelectedSection[]>
  );

  //   Take only the number of sections we need
  const selectedSections = Object.values(groupedSections).map((sections) =>
    sections.slice(0, sectionsPerCourse)
  );

  return selectedSections.flat();
};

// Manage Schedule
export const readAllSchedule = async (
  userId: string,
  scheduleId: string
): Promise<SelectedSection[]> => {
  const schedule = await getScheduleById(userId, scheduleId);
  if (!schedule) {
    return [];
  }
  const sections = await getSectionsByIds(
    schedule.sections.map((section) => section.classNumber),
    schedule.term
  );
  if (!sections) {
    return [];
  }
  const fetchedSelectedSections = await getSelectedSectionsByUserId(
    userId,
    schedule.term as CourseTerm
  );
  const selectedSections = sections.map((section) =>
    transformSectionToSelectedSection(section, fetchedSelectedSections)
  );
  return selectedSections;
};

const checkForTimeConflicts = (
  scheduleMeetings: Meeting[],
  sectionMeetings: Meeting[]
): boolean => {
  // Helper function to convert time string to minutes since midnight
  const timeToMinutes = (time: string | null): number => {
    if (!time) return 0;
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Helper function to check if two time ranges overlap
  const doTimesOverlap = (
    start1: string | null,
    end1: string | null,
    start2: string | null,
    end2: string | null
  ): boolean => {
    if (!start1 || !end1 || !start2 || !end2) return false;

    const start1Minutes = timeToMinutes(start1);
    const end1Minutes = timeToMinutes(end1);
    const start2Minutes = timeToMinutes(start2);
    const end2Minutes = timeToMinutes(end2);

    return start1Minutes <= end2Minutes && start2Minutes <= end1Minutes;
  };

  // Check each meeting in the schedule against each meeting in the section
  for (const scheduleMeeting of scheduleMeetings) {
    for (const sectionMeeting of sectionMeetings) {
      // Check if there are any common days
      const commonDays = scheduleMeeting.days.filter((day) =>
        sectionMeeting.days.includes(day)
      );

      // If there are common days, check for time overlap
      if (commonDays.length > 0) {
        if (
          doTimesOverlap(
            scheduleMeeting.start_time,
            scheduleMeeting.end_time,
            sectionMeeting.start_time,
            sectionMeeting.end_time
          )
        ) {
          return true; // Found a conflict
        }
      }
    }
  }

  return false; // No conflicts found
};

export const getSectionsWithPairs = async (
  sections: Section[] | SelectedSection[],
  term: CourseTerm
): Promise<Section[] | SelectedSection[]> => {
  // Get all class pair numbers from sections
  const classPairNumbers = sections
    .map((section) => section.classPair)
    .filter((classPair): classPair is number => classPair !== null);

  // Get all original class numbers
  const originalClassNumbers = sections.map((section) => section.classNumber);

  // Get only class pair numbers that aren't in the original list
  const uniquePairNumbers = classPairNumbers.filter(
    (classNumber) => !originalClassNumbers.includes(classNumber)
  );

  // Fetch the paired sections
  const pairedSections = await getSectionsByIds(uniquePairNumbers, term);

  if (!pairedSections) {
    return sections;
  }

  // Check if the first section has properties unique to Section type
  const isSectionType = "subject" in sections[0];

  if (isSectionType) {
    // If input is Section[], return Section[]
    return [...(sections as Section[]), ...pairedSections];
  } else {
    // If input is SelectedSection[], transform paired sections to SelectedSection[]
    const transformedPairedSections = pairedSections.map((section) =>
      transformSectionToSelectedSection(section, [])
    );
    return [...(sections as SelectedSection[]), ...transformedPairedSections];
  }
};

export const addToSchedule = async ({
  userId,
  classNumbersToAdd,
  scheduleId,
  preferences,
  selectedSections,
}: {
  userId: string;
  classNumbersToAdd: number[];
  scheduleId: string;
  preferences: any;
  selectedSections: SelectedSection[];
}): Promise<{
  classNumbersAdded: number[];
  messageToAdd: string;
  updatedSchedule: ScheduleResponse | null;
}> => {
  const schedule = await getScheduleById(userId, scheduleId);
  if (!schedule) {
    return {
      classNumbersAdded: [],
      messageToAdd: "",
      updatedSchedule: null,
    };
  }
  const meetings = schedule.sections.flatMap((s) => s.meetings);
  let sectionsToAdd: number[] = [];
  let messageToAdd = "";

  let sections: Section[] =
    (await getSectionsByIds(classNumbersToAdd, schedule.term)) || [];

  // Get all sections including their pairs
  const sectionsWithPairs = await getSectionsWithPairs(sections, schedule.term);
  sections = sectionsWithPairs as Section[];

  //  TODO: When checking for time conflicts, we should also check for conflicts between the classNumbersToAdd
  for (const section of sections) {
    // Check for time conflicts
    const existingSection = schedule.sections.find(
      (s) => s.classNumber === section.classNumber
    );
    if (existingSection) {
      if (
        (!preferences?.checkForTimeConflicts ||
          preferences?.checkForTimeConflicts === false) &&
        checkForTimeConflicts(meetings as Meeting[], section.meetings)
      ) {
        messageToAdd += `Cannot add section ${section.courseId} (${section.classNumber}) because it conflicts with another section in your schedule.\n`;
      }
    } else {
      sectionsToAdd.push(section.classNumber);
      messageToAdd += `Added section ${section.courseId} (class number: ${section.classNumber}) to your schedule.\n`;
    }
  }
  // Remove duplicates
  sectionsToAdd = [...new Set(sectionsToAdd)];

  if (sectionsToAdd.length === 0) {
    return {
      classNumbersAdded: [],
      messageToAdd,
      updatedSchedule: null,
    };
  }

  const sectionsToAddWithTerm = sectionsToAdd.map((section) => ({
    sectionId: section,
    term: schedule.term,
  }));

  const updatedSections = sectionsToAdd.concat(
    schedule.sections.map((s) => s.classNumber)
  );
  // else add all sections to selectedSections
  await bulkPostSelectedSections(
    userId,
    sectionsToAddWithTerm,
    "add",
    selectedSections
  );
  // and to schedule all at once

  await createOrUpdateSchedule(
    userId,
    updatedSections,
    schedule.term,
    schedule.id
  );

  const updatedSchedule = await getScheduleById(userId, scheduleId);
  return {
    classNumbersAdded: sectionsToAdd,
    messageToAdd,
    updatedSchedule,
  };
};

export const removeFromSchedule = async ({
  userId,
  classNumbersToRemove,
  scheduleId,
}: {
  userId: string;
  classNumbersToRemove: number[];
  scheduleId: string;
}): Promise<{
  classNumbersRemoved: number[];
  messageToAdd: string;
}> => {
  // Get the latest schedule state
  const schedule = await getScheduleById(userId, scheduleId);
  if (!schedule) {
    return {
      classNumbersRemoved: [],
      messageToAdd: "",
    };
  }

  // Find all sections to remove, including their class pairs
  const sectionsToRemove = schedule.sections.filter((s) =>
    classNumbersToRemove.includes(s.classNumber)
  );

  // Get all class numbers to remove (including class pairs)
  const allClassNumbersToRemove = [
    ...new Set([
      ...sectionsToRemove.map((s) => s.classPair),
      ...sectionsToRemove.map((s) => s.classNumber),
    ]),
  ].filter((classNumber): classNumber is number => classNumber !== null);

  return {
    classNumbersRemoved: allClassNumbersToRemove,
    messageToAdd: `Removed sections ${sectionsToRemove
      .map((s) => `${s.courseId} (classNumber: ${s.classNumber})`)
      .join(", ")} from your schedule.\n`,
  };
};

export const transformSectionToSelectedSection = (
  section: Section,
  selectedSections: SelectedSection[]
): SelectedSection => {
  return {
    courseId: section.courseId,
    courseName: section.courseName,
    classNumber: section.classNumber,
    component: section.component,
    units: section.units,
    professors: section.instructors.map((professor) => ({
      name: professor.name,
      id:
        section.instructorsWithRatings?.find(
          (instructor) => instructor.name === professor.name
        )?.id ?? null,
    })),
    enrollmentStatus: section.enrollmentStatus,
    meetings: section.meetings,
    classPair: section.classPair,
    rating:
      section.instructorsWithRatings?.find(
        (instructor) => instructor.name === section.instructors[0].name
      )?.overallRating ?? 0,
    color:
      selectedSections.find((s) => s.classNumber === section.classNumber)
        ?.color ?? getColorForCourseId(section.courseId),
  };
};

export async function findSectionsByFilter(
  query: Record<string, any>,
  term: CourseTerm = "fall2025"
): Promise<{ sections: Section[]; total: number }> {
  try {
    let result;

    // Use the appropriate collection based on term
    if (term === "summer2025") {
      result = await summerSectionCollection.findSectionsByFilter(query, 0, 25);
    } else if (term === "spring2025") {
      result = await sectionCollection.findSectionsByFilter(query, 0, 25);
    } else {
      // fall2025 by default
      result = await fallSectionCollection.findSectionsByFilter(query, 0, 25);
    }

    return {
      sections: result.sections,
      total: result.total,
    };
  } catch (e) {
    console.error("MongoDB error:", e);
    return { sections: [], total: 0 };
  }
}
