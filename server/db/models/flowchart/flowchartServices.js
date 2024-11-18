import * as flowchartModel from "./flowchartCollection.js";
import { searchFlowInfo } from "../flowInfo/flowInfoServices.js";
// Create
// Make it so that we have a 1:1 relationship between the user and the flowchart
// If the user already has a flowchart, we update it, otherwise we create a new one
export const createFlowchart = async (flowchartData, name, userId) => {
  let flowchartName = "Untitled Flowchart";
  let primaryOption = false;
  let flowchartList = [];
  try {
    const flowchartInfo =
      (await searchFlowInfo(undefined, undefined, name))[0] ||
      "Untitled Flowchart";
    flowchartName = flowchartInfo.concName;
    flowchartList = (await fetchAllFlowcharts(userId)) || [];
    // If there are no flowcharts, or all flowcharts are not primary, then the new flowchart is primary
    primaryOption =
      flowchartList.length === 0 ||
      flowchartList.every((flowchart) => !flowchart.primaryOption);
    try {
      const result = await flowchartModel.createFlowchart(
        flowchartData,
        flowchartName,
        primaryOption,
        userId
      );
      return {
        flowchartId: result.insertedId,
        name: flowchartName,
        primaryOption,
      };
    } catch (error) {
      throw new Error("Service error Creating Flowchart: " + error.message);
    }
  } catch (error) {
    throw new Error(error);
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
        primaryOption: flowchart.primaryOption,
      };
    });
    return flowchartList;
  } catch (error) {
    console.error("Error fetching all flowcharts:", error);
    return [];
  }
};

// Update
export const updateFlowchart = async (
  flowchartId,
  flowchartData,
  name,
  primaryOption,
  userId
) => {
  try {
    const result = await flowchartModel.updateFlowchart(
      flowchartId,
      flowchartData,
      name,
      primaryOption,
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

// Other Handlers
export const updateAllOtherFlowcharts = async (flowchartId, userId) => {
  try {
    const result = await flowchartModel.updateAllOtherFlowcharts(
      flowchartId,
      userId
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
