import {
  SelectedSection,
  SelectedSectionDocument,
} from "@polylink/shared/types";
import { getDb } from "../../connection";
import { Collection, UpdateResult } from "mongodb";
import { environment } from "../../../index";
let selectedSectionCollection: Collection<SelectedSectionDocument>;

const initializeCollection = (): Collection<SelectedSectionDocument> => {
  return getDb().collection("selectedSections");
};

/**
 * Finds all selected sections for a given user.
 * @param userId The ID of the user to find selected sections for.
 * @returns The selected sections for the user.
 */
export const findSelectedSectionsByUserId = async (
  userId: string
): Promise<SelectedSectionDocument | null> => {
  if (!selectedSectionCollection) {
    selectedSectionCollection = initializeCollection();
  }
  try {
    const result = await selectedSectionCollection.findOne({ userId });
    if (!result) {
      return null;
    }
    return result;
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};

// Delete /selectedSections/:id
export const deleteSelectedSection = async (
  userId: string,
  sectionId: string
): Promise<void> => {
  if (!selectedSectionCollection) {
    selectedSectionCollection = initializeCollection();
  }
  try {
    await selectedSectionCollection.deleteOne({
      userId,
      sectionId,
    });
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};

export const createOrUpdateSelectedSection = async (
  userId: string,
  newSection: SelectedSection
): Promise<UpdateResult<SelectedSectionDocument>> => {
  if (!selectedSectionCollection) {
    selectedSectionCollection = initializeCollection();
  }
  try {
    const updateResult = await selectedSectionCollection.updateOne(
      { userId },
      { $addToSet: { selectedSections: newSection } },
      { upsert: true }
    );

    return updateResult;
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};
