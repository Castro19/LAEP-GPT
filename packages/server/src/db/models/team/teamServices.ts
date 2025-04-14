import * as TeamModel from "./teamCollection";
import { TeamDocument } from "@polylink/shared/types";

export const getTeamMembers = async (): Promise<TeamDocument[]> => {
  try {
    const teamMembers = await TeamModel.findAllTeamMembers();
    return teamMembers;
  } catch (error) {
    throw new Error("Service error: " + (error as Error).message);
  }
};
