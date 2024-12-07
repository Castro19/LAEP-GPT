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
var courses_exports = {};
__export(courses_exports, {
  default: () => courses_default
});
module.exports = __toCommonJS(courses_exports);
var import_express = __toESM(require("express"));
var import_courseServices = require("../db/models/courses/courseServices");
const router = import_express.default.Router();
router.get("/", async (req, res) => {
  try {
    const result = await (0, import_courseServices.getCourses)(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to get courses:", error);
    res.status(500).send("Failed to get courses: " + error.message);
  }
});
router.get("/subjectNames", async (req, res) => {
  try {
    const result = await (0, import_courseServices.getSubjectNames)(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to get courses by subject:", error);
    res.status(500).send("Failed to get courses: " + error.message);
  }
});
router.get("/subject", async (req, res) => {
  try {
    const result = await (0, import_courseServices.getCoursesBySubject)(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to get courses by subject:", error);
    res.status(500).send("Failed to get courses: " + error.message);
  }
});
router.get("/course", async (req, res) => {
  try {
    const result = await (0, import_courseServices.getCourse)(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to get course:", error);
    res.status(500).send("Failed to get course: " + error.message);
  }
});
var courses_default = router;
