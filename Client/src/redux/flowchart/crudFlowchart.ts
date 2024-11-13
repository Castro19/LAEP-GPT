import { Octokit } from "@octokit/rest";
import { fetchFlowchartData } from "./flowchartSlice";
import { AppDispatch } from "../store";
import { resetFlowchartData } from "./flowchartSlice";

const octokit = new Octokit();

// Constants
const owner = "polyflowbuilder";
const repo = "polyflowbuilder";
const basePath = "api/data/flows/json/dflows";

/**
 * Creates a flowchart based on the catalog options.
 * @param catalogOptions The catalog options.
 * @returns The flowchart data as a JSON object.
 */
/**
 * Helper function to fetch the flowchart data JSON based on user selections.
 * @param dispatch Redux dispatch function
 * @param catalog Selected catalog (e.g., "2022-2026")
 * @param major Selected major (e.g., "Computer Science")
 * @param concentration Selected concentration (e.g., "22-26.52CSCBSU")
 */
export async function fetchFlowchartDataHelper(
  dispatch: AppDispatch,
  catalog: string,
  major: string,
  concentration: string
) {
  // Construct the file path for the JSON file
  const filePath = `api/data/flows/json/dflows/${encodeURIComponent(catalog)}/${encodeURIComponent(
    major
  )}/${encodeURIComponent(concentration)}.json`;

  // Construct the full GitHub raw URL
  const fileUrl = `https://raw.githubusercontent.com/polyflowbuilder/polyflowbuilder/main/${filePath}`;

  try {
    // Reset the flowchart data before fetching new data
    dispatch(resetFlowchartData());

    // Fetch the JSON data from the constructed URL
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch flowchart data from ${fileUrl}`);
    }

    const jsonData = await response.json();

    // Dispatch the action to update the flowchart data in the Redux store
    dispatch(fetchFlowchartData.fulfilled(jsonData, "", ""));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching flowchart data:", error);
    dispatch(fetchFlowchartData.rejected(error.toString(), "", ""));
  }
}

/**
 * Fetches the list of major options based on the selected catalog.
 * @param catalog The catalog year (e.g., "2022-2026").
 * @returns A list of major options.
 */
export async function fetchMajorOptions(catalog: string): Promise<string[]> {
  if (!catalog) {
    return [];
  }
  try {
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path: `${basePath}/${catalog}`,
    });

    if (Array.isArray(response.data)) {
      // Filter directories only (major options)
      return response.data
        .filter((item) => item.type === "dir")
        .map((item) => item.name);
    }

    return [];
  } catch (error) {
    console.error("Error fetching major options:", error);
    return [];
  }
}

/**
 * Fetches the list of concentration options based on the selected major.
 * @param catalog The catalog year (e.g., "2022-2026").
 * @param major The selected major (e.g., "Computer Science").
 * @returns A list of concentration options (file names without extensions).
 */
export async function fetchConcentrationOptions(
  catalog: string,
  major: string
): Promise<string[]> {
  if (!catalog || !major) {
    return [];
  }
  try {
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path: `${basePath}/${catalog}/${major}`,
    });

    if (Array.isArray(response.data)) {
      // Filter JSON files and extract file names without the ".json" extension
      return response.data
        .filter((item) => item.type === "file" && item.name.endsWith(".json"))
        .map((item) => item.name.replace(".json", ""));
    }

    return [];
  } catch (error) {
    console.error("Error fetching concentration options:", error);
    return [];
  }
}
