import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { initializeApp, cert } from "firebase-admin/app";

import { connectToDb } from "./db/connection";
import { authenticate } from "./middlewares/authMiddleware";
// Routes
import authRouter from "./routes/auth";
import assistantRouter from "./routes/assistant";
import userRouter from "./routes/user";
import courseRouter from "./routes/courses";
import chatLogRouter from "./routes/chatLog";
import flowchartRouter from "./routes/flowchart";
import flowInfoRouter from "./routes/flowInfo";
import messageAnalyticRouter from "./routes/analytics/messageAnalytics";
import professorRatingRouter from "./routes/professorRating";
import llmRouter from "./routes/llm";

// LLM API
import OpenAI from "openai";

// Initialize express app
const app = express();
const port = process.env.PORT || 4000;
console.log("port: ", port);

const firebaseConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
};
initializeApp(firebaseConfig);

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

// Routes
app.use("/analytics", authenticate, messageAnalyticRouter);
app.use("/assistants", authenticate, assistantRouter);
app.use("/auth", authRouter);
app.use("/chatLogs", authenticate, chatLogRouter);
app.use("/courses", authenticate, courseRouter);
app.use("/users", authenticate, userRouter);
app.use("/flowcharts", authenticate, flowchartRouter);
app.use("/flowInfo", authenticate, flowInfoRouter);
app.use("/professorRatings", professorRatingRouter);
app.use("/llms", llmRouter);

// Initialize OpenAI API client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export const formatAssistantId = process.env.FORMAT_ASST_ID;
export const qdrant = {
  qdrantUrl: process.env.QDRANT_URL,
  qdrantApiKey: process.env.QDRANT_API_KEY,
};

export const environment = process.env.ENVIRONMENT;
// Connect to the database and start the server
connectToDb()
  .then(() => {
    app.listen(port, () => {
      if (environment === "dev") {
        console.log(`Server listening at http://localhost:${port}`);
      }
    });
  })
  .catch((error) => {
    if (environment === "dev") {
      console.error("Failed to connect to the database:", error);
    }
  });
