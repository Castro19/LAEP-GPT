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
var user_exports = {};
__export(user_exports, {
  default: () => user_default
});
module.exports = __toCommonJS(user_exports);
var import_express = __toESM(require("express"));
var import_userServices = require("../db/models/user/userServices");
var import_authMiddleware = require("../middlewares/authMiddleware");
const router = import_express.default.Router();
router.get("/me", async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).send("No user found in request");
    }
    const user = await (0, import_userServices.getUserByFirebaseId)(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send("Failed to get user: " + error.message);
  }
});
router.put("/me", async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).send("No user found in request");
    }
    const updateData = req.body;
    const updatedUser = await (0, import_userServices.updateUser)(userId, updateData);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).send("Failed to update user: " + error.message);
  }
});
router.get("/", (0, import_authMiddleware.authorizeRoles)(["admin"]), async (req, res) => {
  try {
    const users = await (0, import_userServices.getAllUsers)();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send("Failed to get users: " + error.message);
  }
});
var user_default = router;
