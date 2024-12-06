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
var userCollection_exports = {};
__export(userCollection_exports, {
  createUser: () => createUser,
  findAllUsers: () => findAllUsers,
  findUserByFirebaseId: () => findUserByFirebaseId,
  updateUserByFirebaseId: () => updateUserByFirebaseId
});
module.exports = __toCommonJS(userCollection_exports);
var import_connection = require("../../connection");
let userCollection;
const initializeCollection = () => {
  userCollection = (0, import_connection.getDb)().collection("users");
};
const createUser = async (userData) => {
  if (!userCollection) initializeCollection();
  console.log("Creating user in database", userData);
  try {
    const newUser = {
      userId: userData.userId,
      name: userData.name,
      userType: userData.userType,
      email: userData.email,
      bio: userData.bio,
      year: userData.year,
      interests: userData.interests,
      courses: userData.courses,
      availability: userData.availability,
      canShareData: userData.canShareData,
      startingYear: userData.startingYear,
      catalog: userData.catalog,
      major: userData.major,
      concentration: userData.concentration,
      flowchartId: userData.flowchartId
    };
    const result = await userCollection.insertOne(newUser);
    return result;
  } catch (error) {
    throw new Error("Error creating a new user: " + error.message);
  }
};
const findUserByFirebaseId = async (firebaseUserId) => {
  if (!userCollection) initializeCollection();
  try {
    const user = await userCollection.findOne({ userId: firebaseUserId });
    return user;
  } catch (error) {
    throw new Error("Error finding user: " + error.message);
  }
};
const updateUserByFirebaseId = async (firebaseUserId, updateData) => {
  if (!userCollection) initializeCollection();
  try {
    const result = await userCollection.updateOne(
      { userId: firebaseUserId },
      { $set: updateData }
    );
    return result;
  } catch (error) {
    throw new Error("Error updating user: " + error.message);
  }
};
const findAllUsers = async () => {
  if (!userCollection) initializeCollection();
  try {
    const users = await userCollection.find({}).toArray();
    return users;
  } catch (error) {
    throw new Error("Error retrieving all users: " + error.message);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createUser,
  findAllUsers,
  findUserByFirebaseId,
  updateUserByFirebaseId
});
