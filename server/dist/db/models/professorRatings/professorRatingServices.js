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
var professorRatingServices_exports = {};
__export(professorRatingServices_exports, {
  getProfessorRatings: () => getProfessorRatings,
  getProfessorsByCourseIds: () => getProfessorsByCourseIds
});
module.exports = __toCommonJS(professorRatingServices_exports);
var professorRatingCollection = __toESM(require("./professorRatingCollection"));
var import_professorRatingUtil = require("./professorRatingUtil");
const getProfessorRatings = async (professorIds, courseIds) => {
  let query = {
    id: {}
  };
  if (professorIds) {
    query.id = { $in: professorIds };
  }
  try {
    const result = await professorRatingCollection.viewProfessorRatings(query);
    if (result.length === 0) {
      throw new Error("No professor ratings found");
    }
    const filteredResult = (0, import_professorRatingUtil.sortAndLimitReviews)(result, courseIds);
    return filteredResult;
  } catch (error) {
    throw new Error(
      "Error fetching professor ratings: " + error.message
    );
  }
};
const getProfessorsByCourseIds = async (courseIds) => {
  let query = {
    courses: {}
  };
  if (courseIds && courseIds.length > 0) {
    query.courses = { $in: courseIds };
  }
  try {
    const result = await professorRatingCollection.viewProfessorRatings(query);
    console.log("result: ", result);
    if (result.length === 0) {
      throw new Error("No professors found");
    }
    const filteredResult = (0, import_professorRatingUtil.sortAndLimitReviews)(result, courseIds);
    return filteredResult;
  } catch (error) {
    throw new Error(
      "Error fetching professors by course IDs: " + error.message
    );
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getProfessorRatings,
  getProfessorsByCourseIds
});
