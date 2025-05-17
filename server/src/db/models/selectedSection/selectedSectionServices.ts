import { environment } from "../../..";
import * as selectedSelectionModel from "./selectedSectionCollection";
import { SelectedSection, CourseTerm } from "@polylink/shared/types";
import { transformClassNumbersToSelectedSections } from "../schedule/transformSection";
import * as sectionCollection from "../section/sectionCollection";
import * as summerSectionCollection from "../section/summerSectionCollection";
import * as fallSectionCollection from "../section/fallSectionCollection";
import { courseColors } from "../../../constants/colors";
import { getSectionsByIds } from "../section/sectionServices";
import { Section } from "@polylink/shared/types";
// Map to store courseId to color mapping
const courseIdToColorMap = new Map<string, string>();

/**
 * Get a color for a courseId, ensuring the same courseId always gets the same color
 */
export function getColorForCourseId(courseId: string): string {
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
    let section;
    if (term === "summer2025") {
      section = await summerSectionCollection.findSectionsByFilter(
        { classNumber },
        0,
        1
      );
    } else if (term === "fall2025") {
      section = await fallSectionCollection.findSectionsByFilter(
        { classNumber },
        0,
        1
      );
    } else {
      // spring2025
      section = await sectionCollection.findSectionsByFilter(
        { classNumber },
        0,
        1
      );
    }
    return section.sections.length > 0 ? section.sections[0].courseId : null;
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

/**
 * Get the color for a section, prioritizing the current term's color if it exists
 */
export const getSectionColor = async (
  userId: string,
  sectionId: number,
  term: CourseTerm,
  courseId: string
): Promise<string> => {
  try {
    const existingSection =
      await selectedSelectionModel.findSelectedSectionsByUserId(userId);
    console.log("[getSectionColor] Looking for color for:", {
      sectionId,
      term,
      courseId,
      existingSection: existingSection?.selectedSections[term],
    });

    // First try to get the color directly from the section in the current term
    const directColor =
      existingSection?.selectedSections[term]?.[sectionId]?.color;
    if (directColor) {
      console.log("[getSectionColor] Found direct color:", directColor);
      return directColor;
    }

    // If no direct color, look for any section with the same courseId in the current term
    const termSections = existingSection?.selectedSections[term] || {};
    console.log(
      "[getSectionColor] Looking for matching courseId in term sections:",
      termSections
    );

    // Get all sections for this term to find matching courseIds
    const sections = await getSectionsByIds(
      Object.keys(termSections).map(Number),
      term
    );

    if (sections) {
      // Find a section with the same courseId
      const matchingSection = sections.find(
        (s: Section) => s.courseId === courseId
      );
      if (matchingSection) {
        const matchingColor = termSections[matchingSection.classNumber]?.color;
        if (matchingColor) {
          console.log(
            "[getSectionColor] Found color from matching courseId section:",
            {
              classNumber: matchingSection.classNumber,
              color: matchingColor,
            }
          );
          return matchingColor;
        }
      }
    }

    // If still no color found, use the courseId color mapping
    const courseColor = getColorForCourseId(courseId);
    console.log("[getSectionColor] Using courseId color mapping:", courseColor);
    return courseColor;
  } catch (error) {
    if (environment === "dev") {
      console.error("[getSectionColor] Error:", error);
    }
    // Fallback to a random color if there's an error
    const randomColor =
      courseColors[Math.floor(Math.random() * courseColors.length)];
    console.log("[getSectionColor] Using fallback random color:", randomColor);
    return randomColor;
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
    console.log("[postSelectedSection] Existing sections:", {
      userId,
      sectionId: section.sectionId,
      term: section.term,
      existingSections: existingSection?.selectedSections[section.term],
    });

    // Get the courseId for this section
    const courseId = await getCourseIdByClassNumber(
      section.sectionId,
      section.term
    );
    console.log("[postSelectedSection] Found courseId:", courseId);

    if (!courseId) {
      throw new Error("Could not find courseId for section");
    }

    // Get a consistent color for this section/course
    const color = await getSectionColor(
      userId,
      section.sectionId,
      section.term,
      courseId
    );
    console.log("[postSelectedSection] Selected color:", color);

    if (existingSection) {
      if (existingSection.selectedSections[section.term]?.[section.sectionId]) {
        console.log("[postSelectedSection] Section already exists");
        return {
          selectedSections: await getSelectedSectionsByUserId(
            userId,
            section.term
          ),
          message: `Section ${section.sectionId} is already in your schedule`,
        };
      } else {
        console.log(
          "[postSelectedSection] Adding new section with color:",
          color
        );
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
      console.log(
        "[postSelectedSection] Creating first section with color:",
        color
      );
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
      console.error("[postSelectedSection] Error:", error);
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

export const bulkPostSelectedSections = async (
  userId: string,
  sections: Array<{
    sectionId: number;
    term: CourseTerm;
  }>,
  operation: "add" | "remove" = "add",
  selectedSections?: SelectedSection[]
): Promise<{
  selectedSections: SelectedSection[];
  message: string;
}> => {
  try {
    console.log("sections for selected sections", sections);
    const existingSection =
      await selectedSelectionModel.findSelectedSectionsByUserId(userId);

    // Group sections by term for efficient processing
    const sectionsByTerm = sections.reduce(
      (acc, section) => {
        if (!acc[section.term]) {
          acc[section.term] = [];
        }
        acc[section.term].push(section.sectionId);
        return acc;
      },
      {} as Record<CourseTerm, number[]>
    );

    // Prepare the update operation
    const updateOperations: Record<string, any> = {};
    let processedCount = 0;
    let skippedCount = 0;

    // Process each term's sections
    for (const [term, sectionIds] of Object.entries(sectionsByTerm)) {
      for (const sectionId of sectionIds) {
        if (operation === "add") {
          // Skip if section already exists when adding
          if (
            existingSection?.selectedSections[term as CourseTerm]?.[sectionId]
          ) {
            skippedCount++;
            continue;
          }

          // Get courseId and color for the section
          const courseId = await getCourseIdByClassNumber(
            sectionId,
            term as CourseTerm
          );
          const selectedSection = selectedSections?.find(
            (s) => s.courseId === courseId
          );
          const color = selectedSection?.color
            ? selectedSection.color
            : courseId
              ? getColorForCourseId(courseId)
              : courseColors[Math.floor(Math.random() * courseColors.length)];

          // Add to update operations
          updateOperations[`selectedSections.${term}.${sectionId}`] = { color };
        } else {
          // Skip if section doesn't exist when removing
          if (
            !existingSection?.selectedSections[term as CourseTerm]?.[sectionId]
          ) {
            skippedCount++;
            continue;
          }

          // Add to update operations for removal
          updateOperations[`selectedSections.${term}.${sectionId}`] = "";
        }
        processedCount++;
      }
    }

    // If there are no sections to process, return early
    if (Object.keys(updateOperations).length === 0) {
      return {
        selectedSections: await getSelectedSectionsByUserId(
          userId,
          sections[0].term
        ),
        message:
          operation === "add"
            ? `No new sections to add. ${skippedCount} sections were already in your schedule.`
            : `No sections to remove. ${skippedCount} sections were not in your schedule.`,
      };
    }

    // Perform the bulk update
    await selectedSelectionModel.bulkCreateOrUpdateSelectedSections(
      userId,
      updateOperations,
      operation
    );

    return {
      selectedSections: await getSelectedSectionsByUserId(
        userId,
        sections[0].term
      ),
      message:
        operation === "add"
          ? `Successfully added ${processedCount} sections. ${skippedCount} sections were already in your schedule.`
          : `Successfully removed ${processedCount} sections. ${skippedCount} sections were not in your schedule.`,
    };
  } catch (error) {
    if (environment === "dev") {
      console.error("Error in bulkPostSelectedSections:", error);
    }
    throw error;
  }
};
