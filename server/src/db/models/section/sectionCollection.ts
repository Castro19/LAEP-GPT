import { Section, SectionDocument } from "@polylink/shared/types";
import { getDb } from "../../connection";
import { Collection } from "mongodb";

let sectionCollection: Collection<SectionDocument>;

const initializeCollection = (): Collection<SectionDocument> => {
  return getDb().collection("sections");
};

export const findSectionsByFilter = async (query: any): Promise<Section[]> => {
  if (!sectionCollection) {
    sectionCollection = initializeCollection();
  }

  // Standard MongoDB find
  return sectionCollection.find(query).project({ _id: 0 }).toArray() as Promise<
    Section[]
  >;
};
