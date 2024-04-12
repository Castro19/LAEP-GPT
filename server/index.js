import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";
import { fileURLToPath } from "url";
import path, { dirname, join } from "path";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import chooseModel from "./utils/chooseModel.js"; // Make sure the file has `.js` extension or is a directory with an `index.js` file

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize express app
const app = express();
const port = process.env.PORT || 4000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
});
// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.text());

// Serve static files from the React app
// Calculate __dirname equivalent in ES Module

// Now you can use __dirname as before
const clientBuildPath = join(__dirname, "../Client/dist/");
app.use(express.static(clientBuildPath));

// Route to handle POST requests
app.post("/respond", async (req, res) => {
  try {
    const { message, modelType } = req.body;

    const modelDesc = chooseModel(modelType);
    const contentStr =
      "You are a helpful assistant. When you provide explanations or answers, format them using Markdown syntax. For example, use ** for bold text where emphasis is needed. " +
      modelDesc;
    // model: "gpt-3.5-turbo-0125",
    // model: "gpt-4-0613",
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content: contentStr,
        },
        { role: "user", content: message },
      ],
      stream: true,
    });
    const reader = chatCompletion.toReadableStream().getReader();
    // Send the ChatGPT response back to the client
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      res.write(value);
    }
    res.end();
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    res.status(500).json({ error: "Failed to generate response from OpenAI" });
  }
});

app.post("/title", async (req, res) => {
  try {
    const { message, modelType } = req.body;

    const modelDesc = chooseModel(modelType);
    const contentStr =
      "Based on the user's message and the model description, please return a 10-30 character title response that best suits the user's message. Important The response should not be larger than 30 chars and should be a title! Model Description:" +
      modelDesc;
    console.log("Bot Instructions: ", contentStr);
    // model: "gpt-3.5-turbo-0125",
    // model: "gpt-4-0613",
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content: contentStr,
        },
        { role: "user", content: message },
      ],
    });

    // Send the ChatGPT response back to the client
    const title = chatCompletion.choices[0].message.content;
    console.log("TITLE: ", title);
    res.json({ title: title });
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    res.status(500).json({ error: "Failed to generate response from OpenAI" });
  }
});

// Catch-all handler for any other client-side routes
app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong...");
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
