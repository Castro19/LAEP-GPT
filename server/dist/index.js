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
var src_exports = {};
__export(src_exports, {
  formatAssistantId: () => formatAssistantId,
  openai: () => openai,
  qdrant: () => qdrant
});
module.exports = __toCommonJS(src_exports);
var import_dotenv = __toESM(require("dotenv"));
var import_express = __toESM(require("express"));
var import_cors = __toESM(require("cors"));
var import_fs = require("fs");
var import_firebase_admin = __toESM(require("firebase-admin"));
var import_cookie_parser = __toESM(require("cookie-parser"));
var import_connection = require("./db/connection");
var import_authMiddleware = require("./middlewares/authMiddleware");
var import_auth = __toESM(require("./routes/auth"));
var import_user = __toESM(require("./routes/user"));
var import_courses = __toESM(require("./routes/courses"));
var import_chatLog = __toESM(require("./routes/chatLog"));
var import_flowchart = __toESM(require("./routes/flowchart"));
var import_messageAnalytics = __toESM(require("./routes/analytics/messageAnalytics"));
var import_openai = __toESM(require("openai"));
import_dotenv.default.config();
const app = (0, import_express.default)();
const port = process.env.PORT || 4e3;
const serviceAccount = JSON.parse(
  (0, import_fs.readFileSync)("./src/helpers/firebase/laep-firebase.json", "utf8")
);
app.use((0, import_cookie_parser.default)());
app.use(
  (0, import_cors.default)({
    origin: "http://localhost:5173",
    credentials: true
  })
);
app.use(import_express.default.json());
app.use(import_express.default.urlencoded({ extended: true }));
app.use(import_express.default.text({ type: "text/plain" }));
import_firebase_admin.default.initializeApp({
  credential: import_firebase_admin.default.credential.cert(serviceAccount)
});
app.use("/analytics", import_authMiddleware.authenticate, import_messageAnalytics.default);
app.use("/auth", import_auth.default);
app.use("/chatLogs", import_authMiddleware.authenticate, import_chatLog.default);
app.use("/courses", import_authMiddleware.authenticate, import_courses.default);
app.use("/users", import_authMiddleware.authenticate, import_user.default);
app.use("/flowcharts", import_authMiddleware.authenticate, import_flowchart.default);
const openai = new import_openai.default({
  apiKey: process.env.OPENAI_API_KEY
});
const formatAssistantId = process.env.FORMAT_ASST_ID;
const qdrant = {
  qdrantUrl: process.env.QDRANT_URL,
  qdrantApiKey: process.env.QDRANT_API_KEY
};
(0, import_connection.connectToDb)().then(() => {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}).catch((error) => {
  console.error("Failed to connect to the database:", error);
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  formatAssistantId,
  openai,
  qdrant
});
