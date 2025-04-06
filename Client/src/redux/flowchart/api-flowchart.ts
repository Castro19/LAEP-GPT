import { fetchFlowchartData, setLoading } from "./flowchartSlice";
import { AppDispatch } from "../store";
import { resetFlowchartData } from "./flowchartSlice";
import { Course, FlowchartData, Term } from "@polylink/shared/types";
import { environment } from "@/helpers/getEnvironmentVars";

/**
 * Helper function to fetch the flowchart data JSON based on user selections.
 * @param dispatch Redux dispatch function
 * @param catalog Selected catalog (e.g., "2022-2026")
 * @param major Selected major (e.g., "Computer Science")
 * @param concentration Selected concentration (e.g., "22-26.52CSCBSU")
 * @param startYear Start year (e.g., "2022")
 * @param autoFill Whether to auto fill the flowchart (e.g., true)
 */
export async function fetchFlowchartDataHelper(
  dispatch: AppDispatch,
  catalog: string,
  major: string,
  concentration: string,
  startYear: string = "2022",
  autoFill: boolean = true
) {
  // Construct the file path for the JSON file
  const filePath = `api/data/flows/json/dflows/${encodeURIComponent(catalog)}/${encodeURIComponent(
    major
  )}/${encodeURIComponent(concentration)}.json`;

  // Construct the full GitHub raw URL
  const fileUrl = `https://raw.githubusercontent.com/polyflowbuilder/polyflowbuilder/main/${filePath}`;

  const courseUrl = `https://raw.githubusercontent.com/polyflowbuilder/polyflowbuilder/refs/heads/main/api/data/courses/${catalog}/${catalog}.json`;

  try {
    dispatch(setLoading({ type: "fetchFlowchartData", value: true }));
    // Reset the flowchart data before fetching new data
    dispatch(resetFlowchartData());

    // Fetch the JSON data from the constructed URL
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch flowchart data from ${fileUrl}`);
    }

    const jsonData = await response.json();

    const courseResponse = await fetch(courseUrl);
    if (!courseResponse.ok) {
      throw new Error(`Failed to fetch course data from ${courseUrl}`);
    }
    const courseData = await courseResponse.json();

    // Get all the courses from the flowchart data

    const termData = jsonData.termData;

    termData.forEach((term: Term) => {
      term.courses.forEach((course: Course) => {
        if (course.id) {
          // Find the course in the courseData
          const courseFromData = courseData.find(
            (c: Course) => c.id === course.id
          );
          // Add this desc to the course
          course.displayName = courseFromData.displayName;
          course.desc = courseFromData.desc;
          course.units = courseFromData.units;
          course.addl = courseFromData.addl;
        }
      });
    });

    let flowchartData = jsonData;
    if (autoFill && startYear) {
      const year = yearMap(startYear);
      flowchartData = autoFillFlowchart(flowchartData, year);
    }
    const updatedFlowchartData = {
      ...flowchartData,
      startYear: startYear,
    };
    // Dispatch the action to update the flowchart data in the Redux store
    dispatch(fetchFlowchartData.fulfilled(updatedFlowchartData, "", ""));
    return updatedFlowchartData;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (environment === "dev") {
      console.error("Error fetching flowchart data:", error);
    }
    dispatch(fetchFlowchartData.rejected(error.toString(), "", ""));
    dispatch(setLoading({ type: "fetchFlowchartData", value: false }));
  }
}

const autoFillFlowchart = (
  flowchartData: FlowchartData,
  studentYear: number
) => {
  const { termData } = flowchartData;
  const maxTIndex = getMaxTIndex(studentYear);

  termData.forEach((term: Term) => {
    if (term.tIndex <= maxTIndex) {
      term.courses.forEach((course: Course) => {
        // Mark the course as completed
        course.completed = true;
      });
    }
  });

  return flowchartData;
};

const yearMap = (year: string) => {
  switch (year) {
    case "2024":
      return 1;
    case "2023":
      return 2;
    case "2022":
      return 3;
    case "2021":
      return 4;
    case "2020":
      return 4;
    default:
      return 0;
  }
};

const getMaxTIndex = (studentYear: number): number => {
  const yearToTIndexMap: { [key: number]: number } = {
    1: 2, // Freshman
    2: 6, // Sophomore
    3: 10, // Junior
    4: 14, // Senior
  };

  return yearToTIndexMap[studentYear] || 0; // Default to 9 if year is out of range
};
