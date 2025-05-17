import { SelectedSectionDocument, CourseTerm } from "@polylink/shared/types";
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
  sectionId: number,
  term: CourseTerm
): Promise<UpdateResult> => {
  if (!selectedSectionCollection) {
    selectedSectionCollection = initializeCollection();
  }

  try {
    const result = await selectedSectionCollection.updateOne(
      { userId },
      { $unset: { [`selectedSections.${term}.${sectionId}`]: "" } }
    );
    if (result.modifiedCount === 0) {
      throw new Error("Section not found");
    }
    return result;
  } catch (error) {
    if (environment === "dev") {
      console.error(error);
    }
    throw error;
  }
};

export const createOrUpdateSelectedSection = async (
  userId: string,
  newSection: number,
  term: CourseTerm,
  color: string
): Promise<UpdateResult<SelectedSectionDocument>> => {
  if (!selectedSectionCollection) {
    selectedSectionCollection = initializeCollection();
  }
  try {
    // First, check if the document exists and has the correct structure
    const existingDoc = await selectedSectionCollection.findOne({ userId });

    if (existingDoc) {
      // Check if the document has the correct structure
      if (
        !existingDoc.selectedSections ||
        typeof existingDoc.selectedSections !== "object"
      ) {
        // If the structure is incorrect, initialize it with the correct structure
        await selectedSectionCollection.updateOne(
          { userId },
          {
            $set: {
              selectedSections: {
                spring2025: {},
                summer2025: {},
                fall2025: {},
              },
            },
          }
        );
      }
    }

    // Now update with the new section
    const updateResult = await selectedSectionCollection.updateOne(
      { userId },
      {
        $set: {
          [`selectedSections.${term}.${newSection}`]: {
            color: color,
          },
        },
      },
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

export const bulkCreateOrUpdateSelectedSections = async (
  userId: string,
  updateOperations: Record<string, any>,
  operation: "add" | "remove" = "add"
): Promise<UpdateResult<SelectedSectionDocument>> => {
  if (!selectedSectionCollection) {
    selectedSectionCollection = initializeCollection();
  }
  try {
    // First, check if the document exists and has the correct structure
    const existingDoc = await selectedSectionCollection.findOne({ userId });

    if (existingDoc) {
      // Check if the document has the correct structure
      if (
        !existingDoc.selectedSections ||
        typeof existingDoc.selectedSections !== "object"
      ) {
        // If the structure is incorrect, initialize it with the correct structure
        await selectedSectionCollection.updateOne(
          { userId },
          {
            $set: {
              selectedSections: {
                spring2025: {},
                summer2025: {},
                fall2025: {},
              },
            },
          }
        );
      }
    }

    // Now update with all the new sections
    const updateResult = await selectedSectionCollection.updateOne(
      { userId },
      operation === "add"
        ? { $set: updateOperations }
        : { $unset: updateOperations },
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
