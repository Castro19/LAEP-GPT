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
var flowInfoServices_exports = {};
__export(flowInfoServices_exports, {
  searchFlowInfo: () => searchFlowInfo
});
module.exports = __toCommonJS(flowInfoServices_exports);
var flowInfoModel = __toESM(require("./flowInfoCollection"));
function isMajorNameAndCatalog(majorName, catalog) {
  return !!majorName && !!catalog;
}
const searchFlowInfo = async ({
  catalog,
  majorName,
  code
}) => {
  const query = {};
  const projection = {
    _id: 0,
    majorName: 0,
    concName: 0,
    code: 0
  };
  if (code) {
    query.code = code;
    projection.majorName = 1;
    projection.concName = 1;
  } else {
    if (catalog) {
      query.catalog = catalog;
      projection.majorName = 1;
    }
    if (majorName) {
      query.majorName = majorName;
      projection.concName = 1;
      projection.code = 1;
    }
  }
  if (Object.keys(query).length === 0) {
    throw new Error("No valid query parameters provided");
  }
  try {
    const result = await flowInfoModel.searchFlowInfo(query, projection);
    if (isMajorNameAndCatalog(majorName, catalog)) {
      return result;
    } else if (catalog) {
      const uniqueMajorNames = [
        ...new Set(result.map((item) => item.majorName))
      ];
      return uniqueMajorNames;
    }
    return [];
  } catch (error) {
    console.error("Error searching flowinfo:", error);
    return null;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  searchFlowInfo
});
