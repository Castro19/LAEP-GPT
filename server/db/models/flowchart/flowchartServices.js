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

// Read: Get the flowchart associated with the user and the flowchartId
export const fetchFlowchart = async (flowchartId, userId) => {
  try {
    const result = await flowchartModel.fetchFlowchart(flowchartId, userId);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

// Read All: Get all flowcharts associated with the user
export const fetchAllFlowcharts = async (userId) => {
  try {
    const result = await flowchartModel.fetchAllFlowcharts(userId);
    if (result.length === 0) {
      throw new Error("No flowcharts found");
    }
    const flowchartList = result.map((flowchart) => {
      return {
        flowchartId: flowchart._id,
        name: flowchart.name,
      };
    });
    return flowchartList;
  } catch (error) {
    throw new Error(error);
  }
};

// Update
export const updateFlowchart = async (
  flowchartId,
  flowchartData,
  name,
  userId
) => {
  try {
    const result = await flowchartModel.updateFlowchart(
      flowchartId,
      flowchartData,
      name,
      userId
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

// Delete
export const deleteFlowchart = async (flowchartId, userId) => {
  try {
    const result = await flowchartModel.deleteFlowchart(flowchartId, userId);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
