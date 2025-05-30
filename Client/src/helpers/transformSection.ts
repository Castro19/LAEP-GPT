import {
  CourseInfo,
  ProfessorGroup,
  SectionDetail,
  InstructorWithRatings,
  ScheduleBuilderSection,
  SelectedSection,
} from "@polylink/shared/types";
import { Section } from "@polylink/shared/types";

// Instruction Mode Mapping
const INSTRUCTION_MODE_MAP = {
  PA: "Synchronous",
  SM: "Sync/Async;Hybrid",
  P: "In Person/Async;Hybrid",
  PS: "In Person",
  AM: "In Person/Sync;Hybrid",
  SA: "Asynchronous",
};

/**
 * Transforms an array of old-schema Section objects into an array of
 * new-schema CourseInfo objects.
 */
export function transformSectionsToCatalog(sections: Section[]): CourseInfo[] {
  // Group sections by courseId.
  if (!sections) {
    return [];
  }
  const courseMap = sections.reduce((acc, section) => {
    const key = section.courseId;
    if (!acc.has(key)) {
      acc.set(key, []);
    }
    acc.get(key)!.push(section);
    return acc;
  }, new Map<string, Section[]>());

  const courses: CourseInfo[] = [];

  courseMap.forEach((courseSections, courseId) => {
    // Build a lookup of the original sections by classNumber.
    const originalMap = new Map<number, Section>();
    courseSections.forEach((s) => originalMap.set(s.classNumber, s));

    // Transform each Section into a SectionDetail (pairedSections will be updated later).
    const detailMap = new Map<number, SectionDetail>();
    const sectionDetails: SectionDetail[] = courseSections.map((s) => {
      const detail = transformToSectionDetail(s);
      detailMap.set(s.classNumber, detail);
      return detail;
    });

    // Update each SectionDetail with its pairing information.
    // Only add pairing if the other section reciprocates (i.e. its classPair equals the current section’s classNumber).
    courseSections.forEach((s) => {
      if (s.classPair !== null) {
        const pairedOriginal = originalMap.get(s.classPair);
        if (pairedOriginal && pairedOriginal.classPair === s.classNumber) {
          const detail = detailMap.get(s.classNumber);
          const pairedDetail = detailMap.get(s.classPair);
          if (detail && pairedDetail) {
            if (!detail.pairedSections.includes(s.classPair)) {
              detail.pairedSections.push(s.classPair);
            }
            if (!pairedDetail.pairedSections.includes(s.classNumber)) {
              pairedDetail.pairedSections.push(s.classNumber);
            }
          }
        }
      }
    });

    // Group sections by professor.
    // (Note: Each section may list multiple instructors.
    // If instructorsWithRatings is provided (non-null and non-empty) we use that;
    // otherwise we “synthesize” an InstructorWithRatings from the instructors array.)
    const professorGroupMap = new Map<string, ProfessorGroup>();

    sectionDetails.forEach((detail) => {
      let instructors: InstructorWithRatings[] = [];
      // If there are multiple instructors with ratings, we need to map them to the instructors array.
      if (
        detail.instructorsWithRatings &&
        detail.instructorsWithRatings.length > 1
      ) {
        instructors = detail.instructorsWithRatings.map((instr) => ({
          ...instr,
          name:
            detail.instructors.find(
              (instructor) =>
                instructor.name.toLowerCase() === instr.name.toLowerCase()
            )?.name ?? instr.name,
        }));
      }
      // If there is only one instructor with ratings, we can use that directly.
      else if (
        detail.instructorsWithRatings &&
        detail.instructorsWithRatings.length === 1
      ) {
        instructors = detail.instructorsWithRatings.map((instr) => ({
          ...instr,
          name: detail.instructors[0].name,
        }));
      } else if (detail.instructors && detail.instructors.length > 0) {
        // Fallback: use the plain instructor info with default ratings.
        instructors = detail.instructors.map((instr) => ({
          name: instr.name,
          id: instr.name, // using name as a unique identifier
          courseId: courseId,
          overallRating: 0,
          numEvals: 0,
          courseRating: 0,
          studentDifficulties: 0,
        }));
      }

      instructors.forEach((instr) => {
        if (!professorGroupMap.has(instr.id)) {
          professorGroupMap.set(instr.id, {
            instructor: instr,
            sections: [],
            overallRating: instr.overallRating,
            // If courseRating is null, default to 0.
            courseRating: instr.courseRating || 0,
            componentOrder: [],
          });
        } else {
          const group = professorGroupMap.get(instr.id)!;
          group.overallRating = Math.max(
            group.overallRating,
            instr.overallRating
          );
          group.courseRating = Math.max(
            group.courseRating,
            instr.courseRating || 0
          );
        }
        // Add the section to this professor’s group if not already added.
        const group = professorGroupMap.get(instr.id)!;
        if (
          !group.sections.find((sec) => sec.classNumber === detail.classNumber)
        ) {
          group.sections.push(detail);
        }
      });
    });

    // For each professor group, compute the component order based on the sections in the group.
    professorGroupMap.forEach((group) => {
      // Sort sections by classNumber (or adjust the sort as desired).
      group.sections.sort((a, b) => a.classNumber - b.classNumber);
      const compOrder: string[] = [];
      group.sections.forEach((sec) => {
        if (!compOrder.includes(sec.component)) {
          compOrder.push(sec.component);
        }
      });
      group.componentOrder = compOrder;
    });

    // Sort the professor groups by overall rating, then course rating, then meeting time.
    const sortedProfessorGroups = Array.from(professorGroupMap.values()).sort(
      compareProfessorGroups
    );

    // Build the CourseInfo object using the first section's data for the common course fields.
    const first = courseSections[0];
    const courseInfo: CourseInfo = {
      courseId: first.courseId,
      subject: first.subject,
      catalogNumber: first.catalogNumber,
      courseName: first.courseName,
      description: first.description,
      prerequisites: first.prerequisites ?? [],
      units: first.units,
      courseAttributes: first.courseAttributes,
      professorGroups: sortedProfessorGroups,
    };

    courses.push(courseInfo);
  });

  return courses;
}

/**
 * Transforms an old-schema Section into a new-schema SectionDetail.
 */
export function transformToSectionDetail(section: Section): SectionDetail {
  return {
    term: section.term,
    courseId: section.courseId,
    courseName: section.courseName,
    classNumber: section.classNumber,
    units: section.units,
    component: section.component,
    enrollmentStatus: section.enrollmentStatus,
    enrollment: section.enrollment,
    instructionMode: INSTRUCTION_MODE_MAP[section.instructionMode],
    meetings: section.meetings,
    instructors: section.instructors,
    instructorsWithRatings: section.instructorsWithRatings,
    pairedSections: [], // will be filled in later if the section is paired
  };
}

/**
 * Compares two ProfessorGroup objects for sorting.
 * The sort order is:
 *  1. Overall rating (descending)
 *  2. Course rating (descending)
 *  3. Earliest meeting start time (ascending)
 */
function compareProfessorGroups(a: ProfessorGroup, b: ProfessorGroup): number {
  // 1. Overall rating (descending)
  if (a.overallRating !== b.overallRating) {
    return b.overallRating - a.overallRating;
  }
  // 2. Course rating (descending)
  if (a.courseRating !== b.courseRating) {
    return (b.courseRating || 0) - (a.courseRating || 0);
  }
  // 3. Earliest meeting time (ascending)
  const aTime = getEarliestMeetingTimeForGroup(a);
  const bTime = getEarliestMeetingTimeForGroup(b);
  if (aTime && bTime) {
    return aTime.localeCompare(bTime);
  }
  if (aTime) return -1; // a has a valid meeting time; b does not.
  if (bTime) return 1; // b has a valid meeting time; a does not.
  return 0;
}

/**
 * Returns the earliest meeting start time (as a string in HH:MM format)
 * among all sections in a ProfessorGroup.
 * If no meeting start times are found, returns null.
 */
function getEarliestMeetingTimeForGroup(group: ProfessorGroup): string | null {
  let earliest: string | null = null;
  group.sections.forEach((section) => {
    section.meetings.forEach((meeting) => {
      if (meeting.start_time) {
        if (earliest === null || meeting.start_time < earliest) {
          earliest = meeting.start_time;
        }
      }
    });
  });
  return earliest;
}

export function transformSectionsToScheduleBuilderSections(
  sections: SelectedSection[]
): ScheduleBuilderSection[] {
  return sections.map((section) => ({
    courseId: section.courseId,
    classNumber: section.classNumber,
    professors: section.professors.map((professor) => ({
      id: professor.id,
      name: professor.name,
    })),
  }));
}

/**
 * Transforms a Section or SectionDetail to a SelectedSection
 * @param section The Section or SectionDetail to transform
 * @param color The color to assign to the section (default: "#000000")
 * @returns A SelectedSection object
 */
export function transformSectionToSelectedSection(
  section: Section | SectionDetail,
  color: string = "#000000"
): SelectedSection {
  // Extract the first instructor's rating or default to 0
  const rating = section.instructorsWithRatings?.[0]?.overallRating || 0;

  // Transform instructors to professors format
  const professors =
    section.instructorsWithRatings && section.instructorsWithRatings.length > 0
      ? section.instructorsWithRatings.map((instructor) => ({
          name: instructor.name,
          id: instructor.id,
        }))
      : section.instructors.map((instructor) => ({
          name: instructor.name,
          id: instructor.name,
        }));

  // Determine classPair based on the type of section
  let classPair: number | null = null;
  if ("pairedSections" in section && section.pairedSections.length > 0) {
    classPair = section.pairedSections[0];
  } else if ("classPair" in section) {
    classPair = section.classPair;
  }

  // Create the SelectedSection object
  return {
    courseId: section.courseId,
    courseName: section.courseName,
    classNumber: section.classNumber,
    component: section.component,
    units: section.units,
    professors,
    enrollmentStatus: section.enrollmentStatus,
    meetings: section.meetings.map((meeting) => ({
      days: meeting.days,
      start_time: meeting.start_time,
      end_time: meeting.end_time,
    })),
    classPair,
    rating,
    color,
    term: section.term,
  };
}
