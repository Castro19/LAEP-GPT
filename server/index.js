import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
// Routes:
import llms from "./routes/llm.js";
import users from "./routes/user.js";
import chatLogs from "./routes/chatLog.js";
import gpts from "./routes/gpt.js";

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

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong...");
});

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
