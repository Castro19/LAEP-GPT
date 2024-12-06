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
var connection_exports = {};
__export(connection_exports, {
  connectToDb: () => connectToDb,
  getDb: () => getDb
});
module.exports = __toCommonJS(connection_exports);
var import_mongodb = require("mongodb");
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
const URI = process.env.ATLAS_URI || "";
const client = new import_mongodb.MongoClient(URI, {
  serverApi: {
    version: import_mongodb.ServerApiVersion.v1,
    strict: false,
    deprecationErrors: false
  }
});
let db;
async function connectToDb() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    db = client.db("laep");
    return db;
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw new Error("Failed to connect to MongoDB");
  }
}
function getDb() {
  if (!db) {
    throw new Error("Database not connected. Please connect first.");
  }
  return db;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  connectToDb,
  getDb
});
