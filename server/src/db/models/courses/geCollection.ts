import { geData, geDocument } from "@polylink/shared/types";
import { getDb } from "../../connection";
import { Collection } from "mongodb";
import { environment } from "../../..";

let geCollection: Collection<geDocument>;

const initializeCollection = (): void => {
  geCollection = getDb().collection("ge");
};

export const findGeCourses = async (
  subject: string,
  area: string,
  catalogYear: string
): Promise<geData[]> => {
  if (!geCollection) initializeCollection();
  try {
    const ge = await geCollection
      .find({ catalog: catalogYear, category: area, subject: subject })
      .project({ _id: 0 })
      .toArray();

    return ge as geData[];
  } catch (error) {
    if (environment === "dev") {
      console.error("Error fetching GE courses: ", error);
    }
    throw error;
  }
};

export const findGeSubjects = async (
  area: string,
  catalogYear: string
): Promise<geData[]> => {
  if (!geCollection) initializeCollection();
  try {
    const ge = await geCollection
      .find({ catalog: catalogYear, category: area })
      .project({ _id: 0, subject: 1, id: 1 })
      .toArray();

    return ge as geData[];
  } catch (error) {
    if (environment === "dev") {
      console.error("Error fetching GE subjects: ", error);
    }
    throw error;
  }
};

export const findGeAreas = async (catalogYear: string): Promise<geData[]> => {
  if (!geCollection) initializeCollection();
  try {
    const ge = await geCollection
      .find({ catalog: catalogYear })
      .project({ _id: 0, category: 1, id: 1 })
      .toArray();

    return ge as geData[];
  } catch (error) {
    if (environment === "dev") {
      console.error("Error fetching GE areas: ", error);
    }
    throw error;
  }
};
