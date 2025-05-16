import {
  SectionDetail,
  SelectedSection,
  Section,
  Schedule,
  ScheduleResponse,
  CourseTerm,
} from "@polylink/shared/types";
import { courseColors } from "../../../constants/colors";

import { getSectionsByIds } from "../section/sectionServices";
import * as selectedSectionModel from "../selectedSection/selectedSectionCollection";

function getRandomColor(): string {
  return courseColors[Math.floor(Math.random() * courseColors.length)];
}
/**
 * Transforms a Section or SectionDetail to a SelectedSection
 * @param section The Section or SectionDetail to transform
 * @param color The color to assign to the section (default: "#000000")
 * @returns A SelectedSection object
 */
export function transformSectionToSelectedSection(
  section: Section | SectionDetail,
  color: string = getRandomColor()
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
  };
}

/**
 * Transforms a Schedule to a ScheduleResponse by fetching and transforming the sections
 * @param schedule The Schedule to transform
 * @returns A Promise that resolves to a ScheduleResponse
 */
export async function transformScheduleToScheduleResponse(
  schedule: Schedule
): Promise<ScheduleResponse> {
  // Fetch the sections by their IDs
  const sections = await getSectionsByIds(schedule.sections, schedule.term);

  if (!sections) {
    throw new Error("Failed to fetch sections for schedule");
  }

  // Transform each section to a SelectedSection
  const selectedSections: SelectedSection[] = sections.map((section) =>
    transformSectionToSelectedSection(section)
  );

  // Create and return the ScheduleResponse
  return {
    id: schedule.id,
    name: schedule.name,
    sections: selectedSections,
    createdAt: schedule.createdAt,
    updatedAt: schedule.updatedAt,
    term: schedule.term,
  };
}

/**
 * Comprehensive utility function that transforms class numbers into SelectedSection objects
 * This function combines the functionality of Schedule, SelectedSection, and Section collections
 *
 * @param userId The user ID
 * @param classNumbers Array of class numbers to transform
 * @param term The course term (spring2025 or summer2025)
 * @returns A Promise that resolves to an array of SelectedSection objects
 */
export async function transformClassNumbersToSelectedSections(
  userId: string,
  classNumbers: number[],
  term: CourseTerm
): Promise<SelectedSection[]> {
  try {
    // 1. Fetch the sections from the appropriate collection based on term
    const sections = await getSectionsByIds(classNumbers, term);

    if (!sections || sections.length === 0) {
      return [];
    }

    // 2. Fetch the selected sections document to get colors
    const selectedSectionsDoc =
      await selectedSectionModel.findSelectedSectionsByUserId(userId);

    // 3. Create a map to track colors by courseId
    const courseIdToColorMap = new Map<string, string>();

    // 4. First pass: Try to find existing colors for each courseId
    sections.forEach((section) => {
      // Check if we already have a color for this courseId
      if (!courseIdToColorMap.has(section.courseId)) {
        // Try to find a color from the selected sections document
        // First check if the current classNumber has a color
        let color =
          selectedSectionsDoc?.selectedSections[term]?.[section.classNumber]
            ?.color;

        // If no color found for this classNumber, look for any classNumber with the same courseId
        if (!color) {
          // Look through all classNumbers in the selected sections document for this term
          const termSections =
            selectedSectionsDoc?.selectedSections[term] || {};
          for (const [classNum, sectionData] of Object.entries(termSections)) {
            // Find a section with the same courseId
            const matchingSection = sections.find(
              (s) =>
                s.classNumber === Number(classNum) &&
                s.courseId === section.courseId
            );
            if (matchingSection) {
              color = sectionData.color;
              break;
            }
          }
        }

        // If still no color found, generate a random one
        if (!color) {
          color = getRandomColor();
        }

        // Store the color for this courseId
        courseIdToColorMap.set(section.courseId, color);
      }
    });

    // 5. Transform each section to a SelectedSection with the appropriate color
    const selectedSections: SelectedSection[] = sections.map((section) => {
      // Get the color from our map
      const color =
        courseIdToColorMap.get(section.courseId) || getRandomColor();

      // Transform the section to a SelectedSection
      return transformSectionToSelectedSection(section, color);
    });

    return selectedSections;
  } catch (error) {
    console.error(
      "Error transforming class numbers to selected sections:",
      error
    );
    throw error;
  }
}
