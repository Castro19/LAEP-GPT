import { Collection } from "mongodb";
import { getDb } from "../../connection";
import { TeamDocument } from "@polylink/shared/types";
let teamCollection: Collection<TeamDocument>;

// Function to initialize the collection
const initializeCollection = (): void => {
  teamCollection = getDb().collection("team");
};

export const findAllTeamMembers = async (): Promise<TeamDocument[]> => {
  if (!teamCollection) initializeCollection();
  try {
    const teamMembers = await teamCollection.find({}).toArray();
    return teamMembers;
  } catch (error) {
    throw new Error(
      "Error finding all team members: " + (error as Error).message
    );
  }
};
