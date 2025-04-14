import { environment } from "../../..";
import * as selectedSelectionModel from "./selectedSectionCollection";
import { SelectedSection } from "@polylink/shared/types";

export const getSelectedSectionsByUserId = async (
  userId: string
): Promise<SelectedSection[]> => {
  try {
    const result =
      await selectedSelectionModel.findSelectedSectionsByUserId(userId);
    if (!result) {
      return [];
    }
    return result.selectedSections;
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
  section: SelectedSection
): Promise<{
  selectedSections: SelectedSection[];
  message: string;
}> => {
  try {
    const existingSection =
      await selectedSelectionModel.findSelectedSectionsByUserId(userId);
    if (existingSection) {
      if (
        existingSection.selectedSections.some(
          (s) => s.classNumber === section.classNumber
        )
      ) {
        return {
          selectedSections: existingSection.selectedSections,
          message: `Try adding a different section for course ${section.courseId}`,
        };
      } else {
        await selectedSelectionModel.createOrUpdateSelectedSection(
          userId,
          section
        );
        return {
          selectedSections: await getSelectedSectionsByUserId(userId),
          message: `Section ${section.classNumber} added to your schedule`,
        };
      }
    } else {
      await selectedSelectionModel.createOrUpdateSelectedSection(
        userId,
        section
      );
      return {
        selectedSections: await getSelectedSectionsByUserId(userId),
        message: `Section ${section.classNumber} added to your schedule`,
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
  sectionId: string
): Promise<{
  selectedSections: SelectedSection[];
  message: string;
}> => {
  try {
    const result = await selectedSelectionModel.deleteSelectedSection(
      userId,
      parseInt(sectionId)
    );

    if (result.modifiedCount === 0) {
      throw new Error("Section not found");
    }
    return {
      selectedSections: await getSelectedSectionsByUserId(userId),
      message: `Section ${sectionId} removed from your schedule`,
    };
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};
