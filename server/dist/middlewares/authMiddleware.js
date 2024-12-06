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
var authMiddleware_exports = {};
__export(authMiddleware_exports, {
  authenticate: () => authenticate,
  authorizeRoles: () => authorizeRoles
});
module.exports = __toCommonJS(authMiddleware_exports);
var import_firebase_admin = __toESM(require("firebase-admin"));
var import_userServices = require("../db/models/user/userServices");
const authenticate = async (req, res, next) => {
  const sessionCookie = req.cookies?.session || "";
  try {
    const decodedToken = await import_firebase_admin.default.auth().verifySessionCookie(sessionCookie, true);
    req.user = decodedToken;
    const user = await (0, import_userServices.getUserByFirebaseId)(decodedToken.uid);
    if (req.user && user) {
      req.user.role = user.userType;
    }
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).send("Unauthorized");
  }
};
const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (userRole && allowedRoles.includes(userRole)) {
      next();
    } else {
      res.status(403).send("Forbidden: You do not have the required permissions.");
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  authenticate,
  authorizeRoles
});
