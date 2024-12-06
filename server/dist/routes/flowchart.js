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
var flowchart_exports = {};
__export(flowchart_exports, {
  default: () => flowchart_default
});
module.exports = __toCommonJS(flowchart_exports);
var import_express = __toESM(require("express"));
var import_flowchartServices = require("../db/models/flowchart/flowchartServices");
const router = import_express.default.Router();
router.post("/", async (req, res) => {
  const userId = req.user?.uid;
  if (!userId) {
    res.status(401).send("Unauthorized");
    return;
  }
  const { flowchartData, name } = req.body;
  try {
    const result = await (0, import_flowchartServices.createFlowchart)(flowchartData, name, userId);
    res.status(201).json(result);
  } catch (error) {
    console.error("Failed to create flowchart: ", error);
    res.status(500).send("Failed to create flowchart: " + error.message);
  }
});
router.get("/", async (req, res) => {
  const userId = req.user?.uid;
  if (!userId) {
    res.status(401).send("Unauthorized");
    return;
  }
  try {
    const result = await (0, import_flowchartServices.fetchAllFlowcharts)(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to fetch all flowcharts: ", error);
    res.status(500).send("Failed to fetch all flowcharts: " + error.message);
  }
});
router.get("/:flowchartId", async (req, res) => {
  const userId = req.user?.uid;
  if (!userId) {
    res.status(401).send("Unauthorized");
    return;
  }
  try {
    const flowchartId = req.params.flowchartId;
    const result = await (0, import_flowchartServices.fetchFlowchart)(flowchartId, userId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to fetch flowchart: ", error);
    if (error.message === "Flowchart not found") {
      res.status(404).send("Flowchart not found");
    } else if (error.message === "Forbidden") {
      res.status(403).send("Forbidden");
    } else {
      res.status(500).send("Failed to fetch flowchart: " + error.message);
    }
  }
});
router.put("/:flowchartId", async (req, res) => {
  const userId = req.user?.uid;
  if (!userId) {
    res.status(401).send("Unauthorized");
    return;
  }
  try {
    const flowchartId = req.params.flowchartId;
    const { flowchartData, name, primaryOption } = req.body;
    const result = await (0, import_flowchartServices.updateFlowchart)(
      flowchartId,
      flowchartData,
      name,
      primaryOption,
      userId
    );
    if (primaryOption) {
      await (0, import_flowchartServices.updateAllOtherFlowcharts)(flowchartId, userId);
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to update flowchart: ", error);
    if (error.message === "Flowchart not found") {
      res.status(404).send("Flowchart not found");
    } else if (error.message === "Forbidden") {
      res.status(403).send("Forbidden");
    } else {
      res.status(500).send("Failed to update flowchart: " + error.message);
    }
  }
});
router.delete("/:flowchartId", async (req, res) => {
  const userId = req.user?.uid;
  if (!userId) {
    res.status(401).send("Unauthorized");
    return;
  }
  try {
    const flowchartId = req.params.flowchartId;
    const result = await (0, import_flowchartServices.deleteFlowchart)(flowchartId, userId);
    res.status(200).json({
      success: true,
      deletedFlowchartId: flowchartId,
      deletedPrimaryOption: result.deletedPrimaryOption,
      newPrimaryFlowchartId: result.newPrimaryFlowchartId
    });
  } catch (error) {
    console.error("Failed to delete flowchart: ", error);
    if (error.message === "Flowchart not found") {
      res.status(404).send("Flowchart not found");
    } else if (error.message === "Forbidden") {
      res.status(403).send("Forbidden");
    } else {
      res.status(500).send("Failed to delete flowchart: " + error.message);
    }
  }
});
var flowchart_default = router;
