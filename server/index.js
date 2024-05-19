import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
// Routes:
import llms from "./routes/llm.js";
import users from "./routes/user.js";
import chatLogs from "./routes/chatLog.js";

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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong...");
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
