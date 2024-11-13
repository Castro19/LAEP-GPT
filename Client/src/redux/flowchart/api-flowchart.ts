import { fetchFlowchartData } from "./flowchartSlice";
import { AppDispatch } from "../store";
import { resetFlowchartData } from "./flowchartSlice";

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
