"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var assistantCollection_exports = {};
__export(assistantCollection_exports, {
  viewGPTs: () => viewGPTs
});
module.exports = __toCommonJS(assistantCollection_exports);
var import_connection = require("../../connection.js");
let gptCollection;
const initializeCollection = () => {
  gptCollection = (0, import_connection.getDb)().collection("gpts");
};
const viewGPTs = async () => {
  if (!gptCollection) initializeCollection();
  try {
    const result = await gptCollection.find({}).toArray();
    return result;
  } catch (error) {
    throw new Error(
      "Error fetching GPTs from database: " + error.message
    );
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  viewGPTs
});
