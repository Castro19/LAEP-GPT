import * as flowchartModel from "./flowchartCollection.js";

// Create
// Make it so that we have a 1:1 relationship between the user and the flowchart
// If the user already has a flowchart, we update it, otherwise we create a new one
export const createFlowchart = async (flowchartData, userId) => {
  try {
    const result = await flowchartModel.createFlowchart(flowchartData, userId);
    return result;
  } catch (error) {
    throw new Error("Service error Creating Flowchart: " + error.message);
  }
};

// Read

export const fetchFlowchart = async (flowchartId, userId) => {
  try {
    const result = await flowchartModel.fetchFlowchart(flowchartId, userId);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
