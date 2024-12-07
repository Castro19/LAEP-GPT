"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var flowchartServices_exports = {};
__export(flowchartServices_exports, {
  createFlowchart: () => createFlowchart,
  deleteFlowchart: () => deleteFlowchart,
  fetchAllFlowcharts: () => fetchAllFlowcharts,
  fetchFlowchart: () => fetchFlowchart,
  isPrimaryFlowchart: () => isPrimaryFlowchart,
  updateAllOtherFlowcharts: () => updateAllOtherFlowcharts,
  updateFlowchart: () => updateFlowchart
});
module.exports = __toCommonJS(flowchartServices_exports);
var flowchartModel = __toESM(require("./flowchartCollection"));
var import_flowInfoServices = require("../flowInfo/flowInfoServices");
var import_userServices = require("../user/userServices.js");
const createFlowchart = async (flowchartData, name, userId) => {
  let flowchartName = "Untitled Flowchart";
  let primaryOption = false;
  let flowchartList = [];
  try {
    const flowchartInfo = (await (0, import_flowInfoServices.searchFlowInfo)({
      catalog: void 0,
      majorName: void 0,
      code: name
    }))?.[0] || "Untitled Flowchart";
    flowchartName = flowchartInfo.concName;
    flowchartList = await fetchAllFlowcharts(userId) || [];
    primaryOption = flowchartList.length === 0 || flowchartList.every((flowchart) => !flowchart.primaryOption);
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
        primaryOption
      };
    } catch (error) {
      throw new Error(
        "Service error Creating Flowchart: " + error.message
      );
    }
  } catch (error) {
    throw new Error(
      "Service error Creating Flowchart: " + error.message
    );
  }
};
const fetchFlowchart = async (flowchartId, userId) => {
  try {
    const result = await flowchartModel.fetchFlowchart(flowchartId, userId);
    if (!result) {
      throw new Error("Flowchart not found");
    }
    const flowchartMeta = {
      flowchartId: result._id.toString(),
      name: result.name,
      primaryOption: result.primaryOption
    };
    return {
      flowchartData: result.flowchartData,
      flowchartMeta
    };
  } catch (error) {
    throw new Error(
      "Service error Fetching Flowchart: " + error.message
    );
  }
};
const fetchAllFlowcharts = async (userId) => {
  let flowchartList = [];
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
        primaryOption: primaryFlowchart.primaryOption
      };
      flowchartList = [primaryFlowchartFormatted].concat(
        result.filter((flowchart) => !flowchart.primaryOption).map((flowchart) => {
          return {
            flowchartId: flowchart._id.toString(),
            name: flowchart.name,
            primaryOption: flowchart.primaryOption
          };
        })
      );
    } else {
      flowchartList = result.map((flowchart) => {
        return {
          flowchartId: flowchart._id.toString(),
          name: flowchart.name,
          primaryOption: flowchart.primaryOption
        };
      });
    }
    return flowchartList;
  } catch (error) {
    console.error("Error fetching all flowcharts:", error);
    return [];
  }
};
const updateFlowchart = async (flowchartId, flowchartData, name, primaryOption, userId) => {
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
      "Service error Updating Flowchart: " + error.message
    );
  }
};
const deleteFlowchart = async (flowchartId, userId) => {
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
          userId
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
    await (0, import_userServices.updateUser)(userId, {
      flowchartId: newPrimaryFlowchartId || ""
    });
    return {
      success: true,
      deletedFlowchartId: flowchartId,
      deletedPrimaryOption: primaryOption,
      newPrimaryFlowchartId
    };
  } catch (error) {
    throw new Error(
      "Service error Deleting Flowchart: " + error.message
    );
  }
};
const updateAllOtherFlowcharts = async (flowchartId, userId) => {
  try {
    const result = await flowchartModel.updateAllOtherFlowcharts(
      flowchartId,
      userId
    );
    return result;
  } catch (error) {
    throw new Error(
      "Service error Updating All Other Flowcharts: " + error.message
    );
  }
};
const isPrimaryFlowchart = async (flowchartList, flowchartId) => {
  const primaryFlowchart = flowchartList.find(
    (flowchart) => flowchart.flowchartId.toString() === flowchartId
  );
  return primaryFlowchart?.primaryOption || false;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createFlowchart,
  deleteFlowchart,
  fetchAllFlowcharts,
  fetchFlowchart,
  isPrimaryFlowchart,
  updateAllOtherFlowcharts,
  updateFlowchart
});
