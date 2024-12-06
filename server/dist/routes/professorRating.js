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
var professorRating_exports = {};
__export(professorRating_exports, {
  default: () => professorRating_default
});
module.exports = __toCommonJS(professorRating_exports);
var import_express = __toESM(require("express"));
var import_professorRatingServices = require("../db/models/professorRatings/professorRatingServices");
const router = import_express.default.Router();
router.get("/professors/:professorId", async (req, res) => {
  const { professorId } = req.params;
  const professorIdsArray = professorId ? professorId.split(",") : [];
  try {
    const result = await (0, import_professorRatingServices.getProfessorRatings)(professorIdsArray);
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to get courses by subject:", error);
    res.status(404).send("Failed to get courses: " + error.message);
  }
});
router.get("/professors/:professorId/:courseId", async (req, res) => {
  const { professorId, courseId } = req.params;
  const professorIdsArray = professorId ? professorId.split(",") : [];
  const courseIdsArray = courseId ? courseId.split(",") : [];
  try {
    console.log("professorIdsArray: ", professorIdsArray);
    console.log("courseIdsArray: ", courseIdsArray);
    const result = await (0, import_professorRatingServices.getProfessorRatings)(professorIdsArray, courseIdsArray);
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to get courses by subject:", error);
    res.status(404).send("Failed to get courses: " + error.message);
  }
});
router.get("/courses/:courseIds", async (req, res) => {
  const { courseIds } = req.params;
  const courseIdsArray = courseIds ? courseIds.split(",") : [];
  try {
    const result = await (0, import_professorRatingServices.getProfessorsByCourseIds)(courseIdsArray);
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to get professors by course IDs:", error);
    res.status(404).send("Failed to get professors: " + error.message);
  }
});
var professorRating_default = router;
