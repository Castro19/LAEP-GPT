import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { connectToDb } from './db/connection.js';
// Routes:
import llms from "./routes/llm.js";
import users from "./routes/user.js";
import chatLogs from "./routes/chatLog.js";
import gpts from "./routes/gpt.js";
import assistants from './routes/assistants.js';

// LLM API
import OpenAI from "openai";

// Initialize express app
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.text());

// Routes
app.use("/llms", llms);
app.use("/users", users);
app.use("/chatLogs", chatLogs);
app.use("/gpts", gpts);
app.use('/assistants', assistants);

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong...");
});

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Connect to the database and start the server
connectToDb().then(() => {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}).catch(error => {
  console.error('Failed to connect to the database:', error);
});
