import { environment, serverUrl } from "./getEnvironmentVars";
import { TeamDocument } from "@polylink/shared/types";

export const getTeamMembers = async (): Promise<TeamDocument[]> => {
  try {
    const response = await fetch(`${serverUrl}/team`);
    const data = await response.json();
    return data as TeamDocument[];
  } catch (error) {
    if (environment === "dev") {
      console.error("Error fetching team members:", error);
    }
    return [];
  }
};
