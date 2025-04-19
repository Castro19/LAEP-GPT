import {
  SectionDetail,
  SelectedSection,
  Section,
  Schedule,
  ScheduleResponse,
  CourseTerm,
} from "@polylink/shared/types";
import { getSectionsByIds } from "../section/sectionServices";
import * as selectedSectionModel from "../selectedSection/selectedSectionCollection";

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
    section.instructorsWithRatings?.map((instructor) => ({
      name: instructor.name,
      id: instructor.id,
    })) || [];

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
    console.log(
      `Transforming ${classNumbers.length} class numbers for term ${term}`
    );

    // 1. Fetch the sections from the appropriate collection based on term
    const sections = await getSectionsByIds(classNumbers, term);
    console.log(`Fetched ${sections?.length || 0} sections from database`);

    if (!sections || sections.length === 0) {
      console.log("No sections found, returning empty array");
      return [];
    }

    // 2. Fetch the selected sections document to get colors
    const selectedSectionsDoc =
      await selectedSectionModel.findSelectedSectionsByUserId(userId);
    console.log(
      "Selected sections document:",
      JSON.stringify(selectedSectionsDoc, null, 2)
    );

    // 3. Transform each section to a SelectedSection with the appropriate color

    const selectedSections: SelectedSection[] = sections.map((section) => {
      // Get the color from the selected sections document if available
      // The structure is selectedSectionsDoc.selectedSections[term][classNumber].color
      const color =
        selectedSectionsDoc?.selectedSections[term]?.[section.classNumber]
          ?.color || "#000000";

      console.log(`Section ${section.classNumber} color: ${color}`);

      // Transform the section to a SelectedSection
      return transformSectionToSelectedSection(section, color);
    });

    console.log(
      `Transformed ${selectedSections.length} sections to SelectedSection objects`
    );
    return selectedSections;
  } catch (error) {
    console.error(
      "Error transforming class numbers to selected sections:",
      error
    );
    throw error;
  }
}
