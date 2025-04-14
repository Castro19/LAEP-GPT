import { environment, serverUrl } from "@/helpers/getEnvironmentVars";

const fetchProfessors = async (searchTerm: string) => {
  try {
    const response = await fetch(
      `${serverUrl}/professors?searchTerm=${searchTerm}`,
      {
        credentials: "include",
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to fetch professors:", error);
    }
    return [];
  }
};

export default fetchProfessors;
