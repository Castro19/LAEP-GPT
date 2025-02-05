import { Section, SectionDocument } from "@polylink/shared/types";
import { getDb } from "../../connection";
import { Collection, Filter } from "mongodb";

let sectionCollection: Collection<SectionDocument>;

const initializeCollection = (): Collection<SectionDocument> => {
  return getDb().collection("sectionsSpring");
};

export const findSectionsByFilter = async (
  query: Filter<SectionDocument>
): Promise<Section[]> => {
  if (!sectionCollection) {
    sectionCollection = initializeCollection();
  }

  // Standard MongoDB find
  return sectionCollection.find(query).project({ _id: 0 }).toArray() as Promise<
    Section[]
  >;
};
