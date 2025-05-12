import { environment } from "../../..";
import * as selectedSelectionModel from "./selectedSectionCollection";
import {
  SelectedSection,
  CourseTerm,
  SectionEssential,
} from "@polylink/shared/types";
import { transformClassNumbersToSelectedSections } from "../schedule/transformSection";
import * as sectionCollection from "../section/sectionCollection";
import * as summerSectionCollection from "../section/summerSectionCollection";
import { courseColors } from "../../../constants/colors";
import { getSectionsByIds } from "../section/sectionServices";
// Map to store courseId to color mapping
const courseIdToColorMap = new Map<string, string>();

/**
 * Get a color for a courseId, ensuring the same courseId always gets the same color
 */
function getColorForCourseId(courseId: string): string {
  if (courseIdToColorMap.has(courseId)) {
    return courseIdToColorMap.get(courseId)!;
  }

  // Assign a random color to this courseId
  const randomIndex = Math.floor(Math.random() * courseColors.length);
  const color = courseColors[randomIndex];
  courseIdToColorMap.set(courseId, color);
  return color;
}

/**
 * Get the courseId for a given classNumber in either the sections or summer2025 collection
 * based on the term.
 */
async function getCourseIdByClassNumber(
  classNumber: number,
  term: CourseTerm
): Promise<string | null> {
  try {
    // Determine which collection to use based on the term
    if (term === "summer2025") {
      const section = await summerSectionCollection.findSectionsByFilter(
        { classNumber },
        0,
        1
      );
      return section.sections.length > 0 ? section.sections[0].courseId : null;
    } else {
      const section = await sectionCollection.findSectionsByFilter(
        { classNumber },
        0,
        1
      );
      return section.sections.length > 0 ? section.sections[0].courseId : null;
    }
  } catch (error) {
    if (environment === "dev") {
      console.error(
        `Error looking up courseId for classNumber ${classNumber}:`,
        error
      );
    }
    return null;
  }
}

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
      return [];
    }

    // Get all class numbers for the given term
    const classNumbers = Object.keys(result.selectedSections[term] || {}).map(
      Number
    );

    if (classNumbers.length === 0) {
      return [];
    }

    // Use the utility function to transform class numbers into SelectedSection objects
    const selectedSections = await transformClassNumbersToSelectedSections(
      userId,
      classNumbers,
      term
    );

    return selectedSections;
  } catch (error) {
    if (environment === "dev") {
      console.error("Error in getSelectedSectionsByUserId:", error);
    }
    throw error;
  }
};

// Creates a new section or updates an existing section
export const postSelectedSection = async (
  userId: string,
  section: {
    sectionId: number;
    term: CourseTerm;
  }
): Promise<{
  selectedSections: SelectedSection[];
  message: string;
}> => {
  try {
    const existingSection =
      await selectedSelectionModel.findSelectedSectionsByUserId(userId);

    // Get the courseId for this section
    const courseId = await getCourseIdByClassNumber(
      section.sectionId,
      section.term
    );

    // Get a color for this courseId
    const color = courseId
      ? getColorForCourseId(courseId)
      : courseColors[Math.floor(Math.random() * courseColors.length)];

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
          section.sectionId,
          section.term,
          color
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
        section.sectionId,
        section.term,
        color
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
  section: {
    sectionId: number;
    term: CourseTerm;
  }
): Promise<{
  selectedSections: SelectedSection[];
  message: string;
}> => {
  try {
    const result = await selectedSelectionModel.deleteSelectedSection(
      userId,
      section.sectionId,
      section.term
    );

    if (result.modifiedCount === 0) {
      throw new Error("Section not found");
    }
    return {
      selectedSections: await getSelectedSectionsByUserId(userId, section.term),
      message: `Section ${section.sectionId} removed from your schedule`,
    };
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};

export const getSelectedSectionsEssentialsByUserId = async (
  userId: string,
  term: CourseTerm
): Promise<SectionEssential[]> => {
  const selectedSections =
    await selectedSelectionModel.findSelectedSectionsByUserId(userId);
  if (!selectedSections) {
    return [];
  }
  const selectedEssentials = Object.keys(
    selectedSections.selectedSections[term] || {}
  ).map(Number);

  // getSectionsByIds
  const sections = await getSectionsByIds(selectedEssentials, term);
  if (!sections) {
    return [];
  }

  return sections.map((section) => {
    return {
      classNumber: section.classNumber,
      courseId: section.courseId,
      courseName: section.courseName,
      units: section.units,
      instructors: section.instructors,
      instructorsWithRatings: [],
      classPair: section.classPair,
      meetings: section.meetings,
    };
  });
};
