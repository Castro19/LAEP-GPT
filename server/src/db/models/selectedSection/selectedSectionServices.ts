import { environment } from "../../..";
import * as selectedSelectionModel from "./selectedSectionCollection";
import {
  SelectedSection,
  SelectedSectionItem,
  Meeting,
  InstructorWithRatings,
  CourseTerm,
} from "@polylink/shared/types";
import { transformClassNumbersToSelectedSections } from "../schedule/transformSection";

export const getSelectedSectionsByUserId = async (
  userId: string,
  term: CourseTerm
): Promise<SelectedSection[]> => {
  try {
    console.log(
      `Getting selected sections for user ${userId} and term ${term}`
    );

    const result =
      await selectedSelectionModel.findSelectedSectionsByUserId(userId);
    if (!result) {
      console.log("No selected sections document found for user");
      return [];
    }

    // Check if the document has the correct structure
    if (
      !result.selectedSections ||
      typeof result.selectedSections !== "object"
    ) {
      console.log("Selected sections document has incorrect structure");
      return [];
    }

    // Get all class numbers for the given term
    const classNumbers = Object.keys(result.selectedSections[term] || {}).map(
      Number
    );
    console.log(
      `Found ${classNumbers.length} class numbers for term ${term}:`,
      classNumbers
    );

    if (classNumbers.length === 0) {
      console.log("No class numbers found for term, returning empty array");
      return [];
    }

    // Use the utility function to transform class numbers into SelectedSection objects
    const selectedSections = await transformClassNumbersToSelectedSections(
      userId,
      classNumbers,
      term
    );
    console.log(`Returning ${selectedSections.length} selected sections`);

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
