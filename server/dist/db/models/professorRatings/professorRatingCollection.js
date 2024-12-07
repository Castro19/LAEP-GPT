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
var professorRatingCollection_exports = {};
__export(professorRatingCollection_exports, {
  viewProfessorRatings: () => viewProfessorRatings
});
module.exports = __toCommonJS(professorRatingCollection_exports);
var import_connection = require("../../connection");
let professorRatingCollection;
const initializeCollection = () => {
  professorRatingCollection = (0, import_connection.getDb)().collection("professorRatings");
};
const PROJECTION = {
  _id: 0,
  id: 1,
  firstName: 1,
  lastName: 1,
  numEvals: 1,
  overallRating: 1,
  materialClear: 1,
  studentDifficulties: 3,
  courses: 1,
  tags: 1,
  reviews: 1
};
const viewProfessorRatings = async (query) => {
  if (!professorRatingCollection) initializeCollection();
  try {
    const result = await professorRatingCollection.find(query).project(PROJECTION).toArray();
    return result;
  } catch (error) {
    console.error("Error viewing professor ratings: ", error);
    return [];
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  viewProfessorRatings
});
