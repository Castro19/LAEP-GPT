"use strict";
var import__ = require("../../index.js");
async function addMessage(threadId, message) {
  console.log("Adding a new message to thread: " + threadId);
  const response = await import__.openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: message
  });
  return response;
}
