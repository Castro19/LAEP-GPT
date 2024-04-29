import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
// Routes:
import llms from "./routes/llm.js";
import users from "./routes/user.js";
import { fileURLToPath } from "url";
import path, { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// Serve static files from the React app
// Calculate __dirname equivalent in ES Module
// Now you can use __dirname as before
const clientBuildPath = join(__dirname, "../Client/dist/");
app.use(express.static(clientBuildPath));

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
  console.log(`Example app listening at http://localhost:${port}`);
});
