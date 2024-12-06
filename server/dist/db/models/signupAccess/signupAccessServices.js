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
var signupAccessServices_exports = {};
__export(signupAccessServices_exports, {
  getSignupAccessByEmail: () => getSignupAccessByEmail
});
module.exports = __toCommonJS(signupAccessServices_exports);
var import_connection = require("../../connection");
let signupAccessCollection;
const initializeCollection = () => {
  signupAccessCollection = (0, import_connection.getDb)().collection("signupAccess");
};
const getSignupAccessByEmail = async (email) => {
  if (!signupAccessCollection) initializeCollection();
  try {
    const signupAccessEntry = await signupAccessCollection.findOne({ email });
    if (signupAccessEntry) {
      return signupAccessEntry.role;
    }
    console.log("No sign up access entry found");
    const defaultRole = "student";
    return defaultRole;
  } catch (error) {
    console.error("Error getting signup access by email:", error);
    return "student";
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getSignupAccessByEmail
});
