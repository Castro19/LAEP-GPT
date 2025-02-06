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
    console.error(error);
    throw error;
  }
};

export const postSelectedSection = async (
  userId: string,
  section: SelectedSection
): Promise<SelectedSection[]> => {
  try {
    const result = await selectedSelectionModel.createOrUpdateSelectedSection(
      userId,
      section
    );
    if (result.upsertedId) {
      // If a new document was created, fetch and return it
      return (await getSelectedSectionsByUserId(userId)) as SelectedSection[];
    } else {
      // If the document was updated, return the updated document
      return (await getSelectedSectionsByUserId(userId)) as SelectedSection[];
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteSelectedSection = async (
  userId: string,
  sectionId: string
): Promise<void> => {
  try {
    await selectedSelectionModel.deleteSelectedSection(userId, sectionId);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
