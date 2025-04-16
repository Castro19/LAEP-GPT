import { environment } from "../../..";
import * as selectedSelectionModel from "./selectedSectionCollection";
import {
  SelectedSection,
  SelectedSectionItem,
  Section,
  Meeting,
  InstructorWithRatings,
  CourseTerm,
} from "@polylink/shared/types";
import { getSectionById } from "../section/sectionServices";

export const getSelectedSectionsByUserId = async (
  userId: string,
  term: CourseTerm
): Promise<SelectedSection[]> => {
  try {
    const result =
      await selectedSelectionModel.findSelectedSectionsByUserId(userId);
    if (!result) {
      return [];
    }

    // Check if the document has the correct structure
    if (
      !result.selectedSections ||
      typeof result.selectedSections !== "object"
    ) {
      // If the structure is incorrect, return an empty array
      return [];
    }

    // Fetch full section details for each selected section
    const fullSections: SelectedSection[] = [];
    const sectionsToProcess = term
      ? Object.keys(result.selectedSections[term] || {}).map(Number)
      : Object.values(result.selectedSections).flatMap((termSections) =>
          Object.keys(termSections).map(Number)
        );

    for (const sectionId of sectionsToProcess) {
      try {
        const sectionDetail: Section | null = await getSectionById(
          sectionId,
          term as CourseTerm
        );
        if (sectionDetail) {
          // Transform the section detail to a SelectedSection
          const selectedSection: SelectedSection = {
            courseId: sectionDetail.courseId,
            courseName: sectionDetail.courseName,
            classNumber: sectionDetail.classNumber,
            component: sectionDetail.component,
            units: sectionDetail.units,
            enrollmentStatus: sectionDetail.enrollmentStatus,
            meetings: sectionDetail.meetings.map((meeting: Meeting) => ({
              ...meeting,
              days: meeting.days.filter((day) => day),
            })),
            classPair: sectionDetail.classPair || null,
            professors:
              sectionDetail.instructorsWithRatings?.map(
                (instructor: InstructorWithRatings) => ({
                  name: instructor.name,
                  id: instructor.id,
                })
              ) ?? [],
            rating:
              sectionDetail.instructorsWithRatings?.[0]?.overallRating ||
              sectionDetail.instructorsWithRatings?.[1]?.overallRating ||
              0,
          };
          fullSections.push(selectedSection);
        }
      } catch (error) {
        if (environment === "dev") {
          console.error(`Error fetching section ${sectionId}:`, error);
        }
        // Continue with other sections even if one fails
      }
    }

    return fullSections;
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};

// Creates a new section or updates an existing section
export const postSelectedSection = async (
  userId: string,
  section: SelectedSectionItem
): Promise<{
  selectedSections: SelectedSection[];
  message: string;
}> => {
  try {
    const existingSection =
      await selectedSelectionModel.findSelectedSectionsByUserId(userId);
    if (existingSection) {
      if (existingSection.selectedSections[section.term]?.[section.sectionId]) {
        return {
          selectedSections: await getSelectedSectionsByUserId(
            userId,
            section.term
          ),
          message: `Section ${section.sectionId} is already in your schedule`,
        };
      } else {
        await selectedSelectionModel.createOrUpdateSelectedSection(
          userId,
          section
        );
        return {
          selectedSections: await getSelectedSectionsByUserId(
            userId,
            section.term
          ),
          message: `Section ${section.sectionId} added to your schedule`,
        };
      }
    } else {
      await selectedSelectionModel.createOrUpdateSelectedSection(
        userId,
        section
      );
      return {
        selectedSections: await getSelectedSectionsByUserId(
          userId,
          section.term
        ),
        message: `Section ${section.sectionId} added to your schedule`,
      };
    }
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};

export const deleteSelectedSection = async (
  userId: string,
  sectionId: string,
  term: CourseTerm
): Promise<{
  selectedSections: SelectedSection[];
  message: string;
}> => {
  try {
    const result = await selectedSelectionModel.deleteSelectedSection(
      userId,
      parseInt(sectionId),
      term
    );

    if (result.modifiedCount === 0) {
      throw new Error("Section not found");
    }
    return {
      selectedSections: await getSelectedSectionsByUserId(
        userId,
        term as CourseTerm
      ),
      message: `Section ${sectionId} removed from your schedule`,
    };
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};
