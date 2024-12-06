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
var courseServices_exports = {};
__export(courseServices_exports, {
  getCourse: () => getCourse,
  getCourseInfo: () => getCourseInfo,
  getCourses: () => getCourses,
  getCoursesBySubject: () => getCoursesBySubject,
  getSubjectNames: () => getSubjectNames
});
module.exports = __toCommonJS(courseServices_exports);
var courseCollection = __toESM(require("./courseCollection.js"));
const getCourses = async (queryParams) => {
  const { catalogYear, searchTerm } = queryParams;
  let query = {};
  if (catalogYear) {
    query.catalogYear = catalogYear;
  }
  const filters = [];
  if (searchTerm) {
    const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filters.push({
      courseId: { $regex: "^" + escapedSearchTerm, $options: "i" }
    });
  }
  if (filters.length > 0) {
    query = { ...query, $and: filters };
  }
  return await courseCollection.findCourses(query);
};
const getCourse = async (queryParams) => {
  const { catalogYear, courseId } = queryParams;
  if (!catalogYear || !courseId) {
    throw new Error("Catalog year and course ID are required");
  }
  return await courseCollection.findCourse(catalogYear, courseId);
};
const getCoursesBySubject = async (queryParams) => {
  const { catalogYear, GE, GWR, USCP, subject, page, pageSize } = queryParams;
  let query = {};
  if (!subject) {
    throw new Error("Subject is required");
  }
  if (catalogYear) {
    query.catalogYear = catalogYear;
  }
  const filters = [];
  const isGE = GE === "true";
  const isGWR = GWR === "true";
  const isUSCP = USCP === "true";
  if (isGWR) {
    filters.push({ gwrCourse: true });
  }
  if (isUSCP) {
    filters.push({ uscpCourse: true });
  }
  if (isGE) {
    filters.push({ geCategories: { $exists: true, $ne: [] } });
  }
  if (filters.length > 0) {
    query = { ...query, $and: filters };
  }
  const result = await courseCollection.findCoursesGroupedBySubjectNames(
    subject,
    query,
    page,
    Number(pageSize)
  );
  return result[0].courses;
};
const getSubjectNames = async (queryParams) => {
  const { GWR, USCP } = queryParams;
  let query = {};
  const filters = [];
  const isGWR = GWR === "true";
  const isUSCP = USCP === "true";
  if (isGWR) {
    filters.push({ gwrCourse: true });
  }
  if (isUSCP) {
    filters.push({ uscpCourse: true });
  }
  if (filters.length > 0) {
    query = { ...query, $and: filters };
  }
  return await courseCollection.findSubjectNames(query);
};
const getCourseInfo = async (courseIds) => {
  if (!courseIds) {
    throw new Error("Course IDs are required");
  }
  try {
    return await courseCollection.findCourseInfo(
      courseIds
    );
  } catch (error) {
    console.error("Error fetching course info: ", error);
    throw error;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getCourse,
  getCourseInfo,
  getCourses,
  getCoursesBySubject,
  getSubjectNames
});
