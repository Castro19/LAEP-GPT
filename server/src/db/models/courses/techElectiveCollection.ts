import { TechElectiveDocument } from "@polylink/shared/types";
import { getDb } from "../../connection";
import { Collection } from "mongodb";
import { environment } from "../../..";

let techElectiveCollection: Collection<TechElectiveDocument>;

const initializeCollection = (): void => {
  techElectiveCollection = getDb().collection("techElectives");
};

export const findTechElectiveCourses = async (
  code: string
): Promise<TechElectiveDocument> => {
  if (!techElectiveCollection) initializeCollection();
  try {
    const techElective = await techElectiveCollection.findOne({ code });

    return techElective as TechElectiveDocument;
  } catch (error) {
    if (environment === "dev") {
      console.error("Error fetching tech elective courses: ", error);
    }
    throw error;
  }
};
