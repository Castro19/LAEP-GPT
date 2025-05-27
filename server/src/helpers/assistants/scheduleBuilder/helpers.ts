import {
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
  ProfessorRatingDocument,
  SectionAddedOrRemoved,
} from "@polylink/shared/types";
import { fetchPrimaryFlowchart } from "../../../db/models/flowchart/flowchartServices";
import {
  getSectionsByCourseIds,
  getSectionsByIds,
} from "../../../db/models/section/sectionServices";
import { getScheduleById } from "../../../db/models/schedule/scheduleServices";
import { transformSectionToSelectedSection } from "../../../db/models/schedule/transformSection";
import * as summerSectionCollection from "../../../db/models/section/summerSectionCollection";
import * as sectionCollection from "../../../db/models/section/sectionCollection";
import * as fallSectionCollection from "../../../db/models/section/fallSectionCollection";
import { getProfessorRatings } from "../../../db/models/professorRatings/professorRatingServices";
import { combineClassPairs } from "./formatter";
import { environment } from "../../..";
import {
  SUGGESTED_SECTIONS_PER_COURSE,
  POTENTIAL_SECTIONS_PER_COURSE,
} from "./const";

export const getAlternateSections = async ({
  userId,
  term,
  scheduleId,
  courseIds,
}: {
  userId: string;
  term: CourseTerm;
  scheduleId: string;
  courseIds: string[] | undefined;
}): Promise<SelectedSection[]> => {
  if (!courseIds) {
    return [];
  }

  const schedule = await getScheduleById(userId, scheduleId);

  const sections = await getSectionsByCourseIds(courseIds, term, userId);
  if (!sections) {
    return [];
  }

  const classNumbersInSchedule =
    schedule?.sections.map((section) => section.classNumber) || [];

  const alternateSections = sections.filter(
    (section) => !classNumbersInSchedule.includes(section.classNumber)
  );

  const sortedAlternateSelectedSections = alternateSections
    .sort((a, b) => {
      const ratingA = a.instructorsWithRatings?.[0]?.overallRating ?? 0;
      const ratingB = b.instructorsWithRatings?.[0]?.overallRating ?? 0;
      return ratingB - ratingA; // Sort in descending order
    })
    .map((section) =>
      transformSectionToSelectedSection(
        section,
        getColorForCourseId(section.courseId)
      )
    );
  return sortedAlternateSelectedSections;
};

export const getUserNextEligibleSections = async ({
  userId,
  term,
  numCourses = 3,
}: {
  userId: string;
  term: CourseTerm;
  numCourses: number | undefined;
}): Promise<{
  suggestedSections: SelectedSection[];
  potentialSectionsClassNums: number[];
}> => {
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
    return {
      suggestedSections: [],
      potentialSectionsClassNums: [],
    };
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
    return {
      suggestedSections: [],
      potentialSectionsClassNums: [],
    };
  }
  // Convert sections to SelectedSection format
  const fetchedSections: SelectedSection[] = sections.map((section) =>
    transformSectionToSelectedSection(
      section,
      fetchedSelectedSections.find((s) => s.courseId === section.courseId)
        ?.color
    )
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
    sections.slice(0, POTENTIAL_SECTIONS_PER_COURSE)
  );
  const suggestedSections = Object.values(groupedSections).map((sections) =>
    sections.slice(0, SUGGESTED_SECTIONS_PER_COURSE)
  );

  return {
    suggestedSections: suggestedSections.flat(),
    potentialSectionsClassNums: selectedSections
      .flat()
      .map((s) => s.classNumber),
  };
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
    transformSectionToSelectedSection(
      section,
      fetchedSelectedSections.find((s) => s.courseId === section.courseId)
        ?.color
    )
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
      transformSectionToSelectedSection(
        section,
        (sections as SelectedSection[]).find(
          (s) => s.courseId === section.courseId
        )?.color
      )
    );
    return [...(sections as SelectedSection[]), ...transformedPairedSections];
  }
};

export const addToSchedule = async ({
  userId,
  classNumbersToAdd,
  scheduleId,
  preferences,
}: {
  userId: string;
  classNumbersToAdd: number[];
  scheduleId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  preferences: any;
}): Promise<{
  classNumbersAdded: number[];
  messageToAdd: string;
}> => {
  const schedule = await getScheduleById(userId, scheduleId);
  if (!schedule) {
    return {
      classNumbersAdded: [],
      messageToAdd: "",
    };
  }
  const selectedSections = await getSelectedSectionsByUserId(
    userId,
    schedule.term as CourseTerm
  );
  const meetings = schedule.sections.flatMap((s) => s.meetings);
  let sectionsToAdd: number[] = [];
  let sectionsAdded: SectionAddedOrRemoved[] = [];
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
      sectionsAdded.push({
        courseId: section.courseId,
        classNumber: section.classNumber,
        term: schedule.term,
        color:
          selectedSections.find((s) => s.courseId === section.courseId)
            ?.color || getColorForCourseId(section.courseId),
        professor: section.instructors[0].name,
        rating: section.instructorsWithRatings?.[0]?.overallRating,
      });
    }
  }
  // Remove duplicates
  sectionsToAdd = [...new Set(sectionsToAdd)];

  if (sectionsToAdd.length === 0) {
    return {
      classNumbersAdded: [],
      messageToAdd,
    };
  }

  return {
    classNumbersAdded: sectionsToAdd,
    messageToAdd:
      messageToAdd + `Added sections: ${JSON.stringify(sectionsAdded)}`,
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

  const selectedSections = await getSelectedSectionsByUserId(
    userId,
    schedule.term as CourseTerm
  );

  let sections: Section[] =
    (await getSectionsByIds(allClassNumbersToRemove, schedule.term)) || [];

  // Format sections for the message
  const sectionsRemoved: SectionAddedOrRemoved[] = sections.map((section) => ({
    courseId: section.courseId,
    classNumber: section.classNumber,
    term: schedule.term,
    color:
      selectedSections.find((s) => s.courseId === section.courseId)?.color ||
      getColorForCourseId(section.courseId),
    professor: section.instructors[0].name,
    rating: section.instructorsWithRatings?.[0]?.overallRating,
  }));

  const messageToAdd = `Removed sections: ${JSON.stringify(sectionsRemoved)}`;

  return {
    classNumbersRemoved: allClassNumbersToRemove,
    messageToAdd,
  };
};

export async function findSectionsByFilter(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: Record<string, any>,
  term: CourseTerm = "fall2025",
  sort: Record<string, 1 | -1> = {}
): Promise<{ sections: Section[]; total: number }> {
  try {
    let result;

    // Use the appropriate collection based on term
    if (term === "summer2025") {
      result = await summerSectionCollection.findSectionsByFilter(
        query,
        0,
        25,
        {},
        sort
      );
    } else if (term === "spring2025") {
      result = await sectionCollection.findSectionsByFilter(
        query,
        0,
        25,
        {},
        sort
      );
    } else {
      // fall2025 by default
      result = await fallSectionCollection.findSectionsByFilter(
        query,
        0,
        25,
        {},
        sort
      );
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

export async function buildSectionSummaries(
  sections: SelectedSection[]
): Promise<string[]> {
  // First combine the sections
  const combinedSections = combineClassPairs(sections);

  // Get professor IDs from the combined sections
  const professorIds = Array.from(
    new Set(
      combinedSections.flatMap((sec) =>
        (sec.professors ?? [])
          .map((p) => p.id)
          .filter((id): id is string => !!id)
      )
    )
  );
  const courseIds = Array.from(
    new Set(combinedSections.map((sec) => sec.courseId))
  );

  const projection = {
    firstName: 1,
    lastName: 1,
    overallRating: 1,
    tags: 1,
  } as unknown as Partial<ProfessorRatingDocument>;

  let professorRatings: Partial<ProfessorRatingDocument>[] = [];
  try {
    professorRatings = professorIds.length
      ? await getProfessorRatings(professorIds, courseIds, projection)
      : [];
  } catch (error) {
    if (environment === "dev") {
      console.log("Error fetching professor ratings:", error);
    }
  }

  const ratingMap = new Map<string, Partial<ProfessorRatingDocument>>();
  professorRatings.forEach((doc) => {
    if (doc.id) ratingMap.set(doc.id as string, doc);
  });

  const formatMeetingTimes = (sec: SelectedSection): string => {
    const meetings = sec.meetings.map((m) => {
      const days = Array.isArray(m.days) ? m.days.join(", ") : m.days || "";
      const startTime = m.start_time?.replace(":", "") || "";
      const endTime = m.end_time?.replace(":", "") || "";
      return `${days}: ${startTime}-${endTime}`;
    });
    return meetings.length > 0 ? meetings.join("\n") : "No scheduled meetings";
  };

  const summaries = combinedSections.map((sec) => {
    const courseHeader = `${sec.courseId} – ${sec.classNumber}`;
    const meetingTimes = formatMeetingTimes(sec);

    const professorInfo = (sec.professors ?? [])
      .map((prof) => {
        const rating = prof.id ? ratingMap.get(prof.id) : undefined;
        const score =
          rating?.overallRating !== undefined
            ? rating.overallRating?.toFixed(1)
            : "N/A";

        const tagsSnippet =
          rating?.tags && Object.keys(rating.tags).length
            ? ` [${Object.entries(rating.tags)
                .sort((a, b) => (b[1] as number) - (a[1] as number))
                .slice(0, 3)
                .map(([tag]) => tag)
                .join(", ")} ]`
            : "";

        const ratingUrl =
          prof.id !== prof.name
            ? `https://polyratings.dev/professor/${prof.id}`
            : `https://polyratings.dev/search/name?term=${encodeURIComponent(
                prof.name
              )}`;

        return [
          `Professor: ${prof.name}`,
          `Rating: ${score}/4.0`,
          tagsSnippet ? `Popular tags:${tagsSnippet}` : "",
          `View on PolyRatings: ${ratingUrl}`,
        ]
          .filter(Boolean)
          .join("\n");
      })
      .join("\n\n");

    const sectionsArray = [
      courseHeader,
      "Meeting Times:",
      meetingTimes,
      "",
      "Professor Information:",
      professorInfo,
    ].filter(Boolean);

    const finalStr = sectionsArray.join("\n");
    return finalStr;
  });
  return summaries;
}
