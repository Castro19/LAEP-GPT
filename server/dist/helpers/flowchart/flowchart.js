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
var flowchart_exports = {};
__export(flowchart_exports, {
  default: () => flowchart_default
});
module.exports = __toCommonJS(flowchart_exports);
var import_connection = require("../../db/connection.js");
let courseCollection;
const initializeCourseCollection = () => {
  courseCollection = (0, import_connection.getDb)().collection("courses");
};
const flowchartHelper = async (termData, catalogYear) => {
  if (!courseCollection) initializeCourseCollection();
  const requiredCourses = [];
  let techElectivesLeft = 0;
  let generalWritingMet = false;
  let uscpMet = false;
  for (const term of termData) {
    for (const course of term.courses) {
      if (course.completed) {
        continue;
      }
      if (course.id && requiredCourses.length < 5) {
        requiredCourses.push(course);
      } else if (course.customId && course.customId.includes("Technical Elective")) {
        techElectivesLeft++;
      }
    }
  }
  const courseIds = requiredCourses.map((course) => course.id);
  const coursesFromDB = await courseCollection.find({
    courseId: { $in: courseIds },
    catalogYear
  }).toArray();
  generalWritingMet = coursesFromDB.some((course) => course.gwrCourse === true);
  uscpMet = coursesFromDB.some((course) => course.uscpCourse === true);
  const formattedRequiredCourses = requiredCourses.map((course) => {
    return `${course.id}: ${course.displayName} (${course.units})
${course.desc}`;
  }).join("\n\n");
  return {
    techElectivesLeft,
    generalWritingMet,
    uscpMet,
    formattedRequiredCourses
  };
};
var flowchart_default = flowchartHelper;
