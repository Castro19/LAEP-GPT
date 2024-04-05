require("dotenv").config();
const { OpenAI } = require("openai");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Initialize express app
const app = express();
const port = 4000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
});
// Middleware
app.use(bodyParser.json());
app.use(cors());

// Route to handle POST requests
app.post("/respond", async (req, res) => {
  try {
    const { message } = req.body;
    console.log("MESSAGE: ", message);
    // model: "gpt-3.5-turbo-0125",
    // model: "gpt-4-0613",
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4-0613",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. When you provide explanations or answers, format them using Markdown syntax. For example, use ** for bold text where emphasis is needed.",
        },
        { role: "user", content: message },
      ],
    });

    console.log("PASSED");
    console.log("OpenAI Response:", chatCompletion.choices[0].message.content);

    // Send the ChatGPT response back to the client
    res.json({ botResponse: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    res.status(500).json({ error: "Failed to generate response from OpenAI" });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong...");
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
