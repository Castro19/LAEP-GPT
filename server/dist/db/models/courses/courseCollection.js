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
var courseCollection_exports = {};
__export(courseCollection_exports, {
  findCourse: () => findCourse,
  findCourseInfo: () => findCourseInfo,
  findCourses: () => findCourses,
  findCoursesGroupedBySubjectNames: () => findCoursesGroupedBySubjectNames,
  findSubjectNames: () => findSubjectNames
});
module.exports = __toCommonJS(courseCollection_exports);
var import_connection = require("../../connection");
let courseCollection;
const initializeCollection = () => {
  courseCollection = (0, import_connection.getDb)().collection("courses");
};
const findCourse = async (catalogYear, courseId) => {
  if (!courseCollection) initializeCollection();
  const course = await courseCollection.findOne({ catalogYear, courseId });
  if (!course) {
    return null;
  }
  return course;
};
const findCourses = async (query) => {
  if (!courseCollection) initializeCollection();
  const result = {
    courseId: 1,
    displayName: 1,
    units: 1,
    desc: 1
  };
  const resultLimit = 25;
  try {
    const courses = await courseCollection.find(query).project({ _id: 0, ...result }).limit(resultLimit).toArray();
    return courses;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
};
const findCoursesGroupedBySubjectNames = async (subject, query, page = 1, pageSize = 10) => {
  if (!courseCollection) initializeCollection();
  try {
    query.subject = subject;
    const start = (page - 1) * pageSize;
    const result = await courseCollection.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$subject",
          // Group by the subject field
          courses: {
            $push: {
              courseId: "$courseId",
              displayName: "$displayName",
              units: "$units",
              desc: "$desc"
              // geCategories: "$geCategories",
              // geSubjects: "$geSubjects",
            }
          }
        }
      },
      { $sort: { _id: 1 } },
      // Sort subjects alphabetically
      {
        $project: {
          courses: { $slice: ["$courses", start, pageSize] }
          // Paginate courses array
        }
      }
    ]).toArray();
    return result[0].courses;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
};
const findSubjectNames = async (query) => {
  if (!courseCollection) initializeCollection();
  try {
    const result = await courseCollection.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$subject"
          // Group by the subject field
        }
      },
      { $sort: { _id: 1 } }
      // Sort subjects alphabetically
    ]).toArray();
    return result.map((item) => item._id);
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
};
const findCourseInfo = async (courseIds) => {
  if (!courseCollection) initializeCollection();
  try {
    const result = await courseCollection.find({
      courseId: { $in: courseIds },
      catalogYear: "2022-2026"
    }).project({
      courseId: 1,
      displayName: 1,
      desc: 1,
      units: 1,
      _id: 0
      // Exclude the _id field if not needed
    }).toArray();
    return result;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  findCourse,
  findCourseInfo,
  findCourses,
  findCoursesGroupedBySubjectNames,
  findSubjectNames
});
