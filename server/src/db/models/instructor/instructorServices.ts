import { environment } from "../../..";
import { MongoQuery } from "../../../types/mongo";
import * as instructorCollection from "./instructorCollection";

type InstructorDocument = {
  name: string;
  $id: string;
};

export const getInstructors = async (searchTerm: string): Promise<string[]> => {
  let query = {};

  const filters = [];

  const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  filters.push({
    name: { $regex: escapedSearchTerm, $options: "i" },
  });
  if (environment === "dev") {
    console.log("FILTERS: ", filters);
  }
  // Combine filters
  if (filters.length > 0) {
    query = { ...query, $and: filters };
  }

  return await instructorCollection.findAllInstructors(
    query as MongoQuery<InstructorDocument>[]
  );
};
