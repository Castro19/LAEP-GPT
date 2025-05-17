import { getSelectedSectionsEssentialsByUserId } from "../../../db/models/selectedSection/selectedSectionServices";

import {
  SelectedSection,
  CourseTerm,
  SectionEssential,
  Course,
  Term,
} from "@polylink/shared/types";
import { fetchPrimaryFlowchart } from "../../../db/models/flowchart/flowchartServices";
import { getSectionsByCourseIds } from "../../../db/models/section/sectionServices";

export const getSelectedSectionsTool = async ({
  userId,
  term,
}: {
  userId: string;
  term: CourseTerm;
}): Promise<SectionEssential[]> => {
  const selectedSections = await getSelectedSectionsEssentialsByUserId(
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
}): Promise<SectionEssential[]> => {
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
  if (!sections) {
    return [];
  }
  // Convert sections to SectionEssential format
  const fetchedSections = sections.map((section) => ({
    classNumber: section.classNumber,
    courseId: section.courseId,
    courseName: section.courseName,
    units: section.units,
    instructors: section.instructors,
    instructorsWithRatings: section.instructorsWithRatings || [],
    classPair: section.classPair,
    meetings: section.meetings,
  }));

  //   Group by course id and only take sectionsPerCourse sections per course
  const groupedSections = fetchedSections.reduce(
    (acc, section) => {
      acc[section.courseId] = [...(acc[section.courseId] || []), section];
      return acc;
    },
    {} as Record<string, SectionEssential[]>
  );

  //   Take only the number of sections we need
  const selectedSections = Object.values(groupedSections).map((sections) =>
    sections.slice(0, sectionsPerCourse)
  );

  return selectedSections.flat();
};
