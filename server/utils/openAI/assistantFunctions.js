import { openai } from "../../index.js";

export async function createAssistant(title, description, instructions) {
  const gptInstructions =
    "You are a helpful assistant. When you provide explanations or answers, format them using Markdown syntax. For example, use ** for bold text where emphasis is needed. Make sure this format is in every message! Make sure this format is in every message! Please give responses in a structured way with sections for each instruction response given below:\n" +
    instructions;
  const assistant = await openai.beta.assistants.create({
    name: title,
    description: description,
    instructions: gptInstructions,
    model: "gpt-4o",
  });
  return assistant;
}

export async function deleteAssistant(asstId) {
  const response = await openai.beta.assistants.del(asstId);
  console.log(response);
}
