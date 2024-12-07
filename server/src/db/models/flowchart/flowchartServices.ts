import * as flowchartModel from "./flowchartCollection";
import { searchFlowInfo } from "../flowInfo/flowInfoServices";
import { updateUser } from "../user/userServices.js";
import {
  CreateFlowchartResponse,
  DeleteFlowchartResponse,
  FetchedFlowchartObject,
  FetchFlowchartResponse,
  FlowchartData,
  FlowInfoDocument,
} from "@polylink/shared/types";
import { BulkWriteResult } from "mongodb";
// Create
// Make it so that we have a 1:1 relationship between the user and the flowchart
// If the user already has a flowchart, we update it, otherwise we create a new one
export const createFlowchart = async (
  flowchartData: FlowchartData,
  name: string,
  userId: string
): Promise<CreateFlowchartResponse> => {
  let flowchartName = "Untitled Flowchart";
  let primaryOption = false;
  let flowchartList = [];
  try {
    const flowchartInfo =
      (
        await searchFlowInfo({
          catalog: undefined,
          majorName: undefined,
          code: name,
        })
      )?.[0] || "Untitled Flowchart";
    flowchartName = (flowchartInfo as FlowInfoDocument).concName;
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
        flowchartId: result.insertedId.toString(),
        name: flowchartName,
        primaryOption,
      };
    } catch (error) {
      throw new Error(
        "Service error Creating Flowchart: " + (error as Error).message
      );
    }
  } catch (error) {
    throw new Error(
      "Service error Creating Flowchart: " + (error as Error).message
    );
  }
};

// Read: Get the flowchart associated with the user and the flowchartId
export const fetchFlowchart = async (
  flowchartId: string,
  userId: string
): Promise<FetchFlowchartResponse> => {
  try {
    const result = await flowchartModel.fetchFlowchart(flowchartId, userId);
    if (!result) {
      throw new Error("Flowchart not found");
    }
    const flowchartMeta = {
      flowchartId: result._id.toString(),
      name: result.name,
      primaryOption: result.primaryOption,
    };
    return {
      flowchartData: result.flowchartData,
      flowchartMeta: flowchartMeta,
    };
  } catch (error) {
    throw new Error(
      "Service error Fetching Flowchart: " + (error as Error).message
    );
  }
};

// Read All: Get all flowcharts associated with the user
export const fetchAllFlowcharts = async (
  userId: string
): Promise<FetchedFlowchartObject[]> => {
  let flowchartList: FetchedFlowchartObject[] = [];
  try {
    const result = await flowchartModel.fetchAllFlowcharts(userId);
    if (result.length === 0) {
      throw new Error("No flowcharts found");
    }
    const primaryFlowchart = result.find(
      (flowchart) => flowchart.primaryOption
    );
    if (primaryFlowchart) {
      const primaryFlowchartFormatted = {
        flowchartId: primaryFlowchart._id.toString(),
        name: primaryFlowchart.name,
        primaryOption: primaryFlowchart.primaryOption,
      };
      flowchartList = [primaryFlowchartFormatted].concat(
        result
          .filter((flowchart) => !flowchart.primaryOption)
          .map((flowchart) => {
            return {
              flowchartId: flowchart._id.toString(),
              name: flowchart.name,
              primaryOption: flowchart.primaryOption,
            };
          })
      );
    } else {
      flowchartList = result.map((flowchart) => {
        return {
          flowchartId: flowchart._id.toString(),
          name: flowchart.name,
          primaryOption: flowchart.primaryOption,
        };
      });
    }
    // Make sure that the primary flowchart is always at the top
    return flowchartList;
  } catch (error) {
    console.error("Error fetching all flowcharts:", error);
    return [];
  }
};

// Update
export const updateFlowchart = async (
  flowchartId: string,
  flowchartData: FlowchartData,
  name: string,
  primaryOption: boolean,
  userId: string
): Promise<{ message: string }> => {
  try {
    const result = await flowchartModel.updateFlowchart(
      flowchartId,
      flowchartData,
      name,
      primaryOption,
      userId
    );
    if (!result) {
      throw new Error("Flowchart not found");
    }
    return { message: "Flowchart updated successfully" };
  } catch (error) {
    throw new Error(
      "Service error Updating Flowchart: " + (error as Error).message
    );
  }
};

// Delete
export const deleteFlowchart = async (
  flowchartId: string,
  userId: string
): Promise<DeleteFlowchartResponse> => {
  const flowchartList = await fetchAllFlowcharts(userId);
  const primaryOption = await isPrimaryFlowchart(flowchartList, flowchartId);
  await flowchartModel.deleteFlowchart(flowchartId, userId);
  let newPrimaryFlowchartId = null;

  try {
    if (primaryOption && flowchartList.length > 1) {
      const nextFlowchart = flowchartList.find(
        (flowchart) => flowchart.flowchartId.toString() !== flowchartId
      );
      if (nextFlowchart) {
        const newPrimaryFlowchart = await fetchFlowchart(
          nextFlowchart.flowchartId,
          userId
        );
        newPrimaryFlowchartId = newPrimaryFlowchart.flowchartMeta.flowchartId;
        const newUpdatedPrimaryFlowchart = {
          flowchartId: newPrimaryFlowchartId,
          flowchartData: newPrimaryFlowchart.flowchartData,
          name: newPrimaryFlowchart.flowchartMeta.name,
          primaryOption: true,
          userId: userId,
        };
        await updateFlowchart(
          newUpdatedPrimaryFlowchart.flowchartId,
          newUpdatedPrimaryFlowchart.flowchartData,
          newUpdatedPrimaryFlowchart.name,
          newUpdatedPrimaryFlowchart.primaryOption,
          newUpdatedPrimaryFlowchart.userId
        );
      }
    }
    await updateUser(userId, {
      flowchartId: newPrimaryFlowchartId || "",
    });

    return {
      success: true,
      deletedFlowchartId: flowchartId,
      deletedPrimaryOption: primaryOption,
      newPrimaryFlowchartId,
    } as DeleteFlowchartResponse;
  } catch (error) {
    throw new Error(
      "Service error Deleting Flowchart: " + (error as Error).message
    );
  }
};

// Other Handlers
export const updateAllOtherFlowcharts = async (
  flowchartId: string,
  userId: string
): Promise<BulkWriteResult> => {
  try {
    const result = await flowchartModel.updateAllOtherFlowcharts(
      flowchartId,
      userId
    );
    return result;
  } catch (error) {
    throw new Error(
      "Service error Updating All Other Flowcharts: " + (error as Error).message
    );
  }
};

export const isPrimaryFlowchart = async (
  flowchartList: FetchedFlowchartObject[],
  flowchartId: string
): Promise<boolean> => {
  const primaryFlowchart = flowchartList.find(
    (flowchart) => flowchart.flowchartId.toString() === flowchartId
  );
  return primaryFlowchart?.primaryOption || false;
};
