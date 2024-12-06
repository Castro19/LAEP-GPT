import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { readFileSync } from "fs";
import admin from "firebase-admin";
import cookieParser from "cookie-parser";

import { connectToDb } from "./db/connection";
import { authenticate } from "./middlewares/authMiddleware";
// Routes
import authRouter from "./routes/auth";
import assistants from "./routes/assistant";
import userRouter from "./routes/user";
import courses from "./routes/courses";
import chatLogs from "./routes/chatLog";
import flowcharts from "./routes/flowchart";
import messageAnalytics from "./routes/analytics/messageAnalytics";

// LLM API
import OpenAI from "openai";

// Initialize express app
const app = express();
const port = process.env.PORT || 4000;

const serviceAccount = JSON.parse(
  readFileSync("./src/helpers/firebase/laep-firebase.json", "utf8")
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
app.use("/analytics", authenticate, messageAnalytics);
app.use("/assistants", authenticate, assistants);
app.use("/auth", authRouter);
app.use("/chatLogs", authenticate, chatLogs);
app.use("/courses", authenticate, courses);
app.use("/users", authenticate, userRouter);
app.use("/flowcharts", authenticate, flowcharts);

// Initialize OpenAI API client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export const formatAssistantId = process.env.FORMAT_ASST_ID;
export const qdrant = {
  qdrantUrl: process.env.QDRANT_URL,
  qdrantApiKey: process.env.QDRANT_API_KEY,
};
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
