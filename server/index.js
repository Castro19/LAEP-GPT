import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectToDb } from "./db/connection.js";
import { readFileSync } from "fs";
import admin from "firebase-admin";
import cookieParser from "cookie-parser";
import { authenticate } from "./middlewares/authMiddleware.js";
// Routes
import authRouter from "./routes/auth.js";
import users from "./routes/user.js";
import llms from "./routes/llm.js";
import chatLogs from "./routes/chatLog.js";
import gpts from "./routes/gpt.js";
import messageAnalytics from "./routes/analytics/messageAnalytics.js";
// import assistants from "./routes/assistants.js";
// import signupAccessRouter from "./routes/signupAccess.js";
// import generateTeacherFileRoute from "./routes/teacherFile.js";
// import fileOperations from "./routes/fileOperations.js";
// LLM API
import OpenAI from "openai";

// Initialize express app
const app = express();
const port = process.env.PORT || 4000;
const serviceAccount = JSON.parse(
  readFileSync("./helpers/firebase/laep-firebase.json", "utf8")
);

// Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
); // Enable CORS
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies
app.use(express.text({ type: "text/plain" }));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Routes
app.use("/auth", authRouter);
app.use("/llms", llms);
app.use("/users", authenticate, users);
app.use("/chatLogs", authenticate, chatLogs);
app.use("/gpts", authenticate, gpts);
app.use("/analytics", authenticate, messageAnalytics);
// app.use("/assistants", authenticate, assistants);
// app.use("/signupAccess", signupAccessRouter);
// app.use("/generateTeacherFile", generateTeacherFileRoute);
// app.use("/fileOperations", fileOperations);

// Corrected Error handling middleware
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  console.error(err.stack);
  if (!res.headersSent) {
    res.status(500).send("Internal Server Error");
  } else {
    // If headers are already sent, we can't send any more data
    res.end();
  }
});

// Initialize OpenAI API client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Connect to the database and start the server
connectToDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });
