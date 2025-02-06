import { Section, SectionDocument } from "@polylink/shared/types";
import { getDb } from "../../connection";
import { Collection, Filter } from "mongodb";

let sectionCollection: Collection<SectionDocument>;

const initializeCollection = (): Collection<SectionDocument> => {
  return getDb().collection("sectionsSpring");
};

export const findSectionsByFilter = async (
  query: Filter<SectionDocument>,
  skip: number,
  limit: number
): Promise<{ sections: Section[]; total: number }> => {
  if (!sectionCollection) {
    sectionCollection = initializeCollection();
  }

  // Get total number of matching documents for pagination
  const total = await sectionCollection.countDocuments(query);

  // Then get the specific page with .skip() and .limit()
  const sections = (await sectionCollection
    .find(query)
    .project({ _id: 0 })
    .skip(skip)
    .limit(limit)
    .toArray()) as unknown as Promise<Section[]>;

  return { sections: sections as unknown as Section[], total };
};
