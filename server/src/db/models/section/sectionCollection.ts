import { SectionDocument } from "@polylink/shared/types";
import { getDb } from "../../connection";
import { Collection } from "mongodb";

let sectionCollection: Collection<SectionDocument>;

const initializeCollection = (): Collection<SectionDocument> => {
  return getDb().collection("sections");
};

export const findSectionsByFilter = async (
  query: any
): Promise<SectionDocument[]> => {
  if (!sectionCollection) {
    sectionCollection = initializeCollection();
  }

  // Standard MongoDB find
  return sectionCollection.find(query).toArray();
};
