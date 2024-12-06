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
var auth_exports = {};
__export(auth_exports, {
  default: () => auth_default
});
module.exports = __toCommonJS(auth_exports);
var import_express = __toESM(require("express"));
var import_signupAccessServices = require("../db/models/signupAccess/signupAccessServices");
var import_userServices = require("../db/models/user/userServices");
var import_userServices2 = require("../db/models/user/userServices");
var import_firebase_admin = __toESM(require("firebase-admin"));
const router = import_express.default.Router();
router.get("/", (req, res) => {
  res.status(200).send("Hello World");
});
router.post("/login", async (req, res) => {
  const { token } = req.body;
  const expiresIn = 60 * 60 * 24 * 5 * 1e3;
  try {
    const sessionCookie = await import_firebase_admin.default.auth().createSessionCookie(token, { expiresIn });
    res.cookie("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });
    const decodedToken = await import_firebase_admin.default.auth().verifyIdToken(token);
    const userId = decodedToken.uid;
    const email = decodedToken.email || "";
    const name = decodedToken.name || "";
    let user = await (0, import_userServices2.getUserByFirebaseId)(userId);
    if (!user) {
      const userType = await (0, import_signupAccessServices.getSignupAccessByEmail)(email);
      const userData = {
        userId,
        name,
        userType,
        email,
        bio: "",
        year: "",
        interests: [],
        courses: [],
        availability: {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
          Saturday: [],
          Sunday: []
        },
        canShareData: false,
        startingYear: "",
        catalog: "",
        major: "",
        concentration: "",
        flowchartId: ""
      };
      console.log("Adding user to database");
      const userResponse = await (0, import_userServices.addUser)(userData);
      console.log("User Response: ", userResponse);
      res.status(200).send({ userData, isNewUser: true });
    } else {
      console.log("User already exists in database: ", user);
      res.status(200).send({ userData: user, isNewUser: false });
    }
  } catch (error) {
    console.error("Error creating session cookie:", error);
    res.status(401).send({ error: "Invalid token" });
  }
});
router.post("/logout", (req, res) => {
  res.clearCookie("session");
  res.status(200).send({ message: "Logged out successfully" });
});
router.get("/check", async (req, res) => {
  const sessionCookie = req.cookies.session;
  if (!sessionCookie) {
    console.log("No session cookie found, user not authenticated");
    return res.status(401).send({ error: "Unauthorized" });
  }
  try {
    const decodedToken = await import_firebase_admin.default.auth().verifySessionCookie(sessionCookie, true);
    const userId = decodedToken.uid;
    const user = await (0, import_userServices2.getUserByFirebaseId)(userId);
    if (!user) {
      console.log("User not found in database");
      return res.status(404).send({ error: "User not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    console.error("Failed to verify session cookie:", error);
    res.status(401).send({ error: "Unauthorized" });
  }
});
var auth_default = router;
