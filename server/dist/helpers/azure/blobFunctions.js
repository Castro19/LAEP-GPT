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
var blobFunctions_exports = {};
__export(blobFunctions_exports, {
  handleFileUpload: () => handleFileUpload,
  saveFileLocally: () => saveFileLocally
});
module.exports = __toCommonJS(blobFunctions_exports);
var import__ = require("../../index.js");
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_url = require("url");
const import_meta = {};
const __filename = (0, import_url.fileURLToPath)(import_meta.url);
const __dirname = import_path.default.dirname(__filename);
async function saveFileLocally(file) {
  const uploadDir = import_path.default.join(__dirname, "uploads");
  if (!import_fs.default.existsSync(uploadDir)) {
    import_fs.default.mkdirSync(uploadDir);
  }
  const tempFilePath = file.path;
  const newFilePath = import_path.default.join(uploadDir, file.originalname);
  import_fs.default.renameSync(tempFilePath, newFilePath);
  return newFilePath;
}
async function handleFileUpload(file) {
  try {
    const localFilePath = await saveFileLocally(file);
    const openAIResponse = await uploadFileToOpenAI(localFilePath);
    import_fs.default.unlinkSync(localFilePath);
    return openAIResponse;
  } catch (error) {
    console.error("Error handling file upload:", error);
    throw error;
  }
}
async function uploadFileToOpenAI(filePath) {
  try {
    const fileStream = import_fs.default.createReadStream(filePath);
    const userFile = await import__.openai.files.create({
      file: fileStream,
      purpose: "assistants"
      // Replace this purpose as per your requirement
    });
    return userFile;
  } catch (error) {
    console.error("Error uploading file to OpenAI:", error);
    throw error;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handleFileUpload,
  saveFileLocally
});
