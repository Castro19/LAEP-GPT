import express from "express";
import { openai } from "../index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Create a __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

async function getFiles() {
  try {
    const files = await openai.files.list();
    return files.data;
  } catch (error) {
    console.error("Error retrieving files:", error);
    throw error;
  }
}

async function deleteFile(fileId) {
  try {
    await openai.files.del(fileId);
    console.log(`File ${fileId} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting file ${fileId}:`, error);
    throw error;
  }
}

router.delete("/clear", async (req, res) => {
  try {
    // List all files
    const files = await getFiles();

    // Delete each file
    for (const file of files) {
      await deleteFile(file.id);
    }

    res.status(200).json({ message: "All files cleared successfully." });
  } catch (error) {
    console.error("Error clearing files and vector store:", error);
    res.status(500).json({ error: "Error clearing files and vector store" });
  }
});

// Endpoint to upload a file to OpenAI for a specific assistant and add to a vector store
router.post("/upload/:assistantId", async (req, res) => {
  const filePath = path.join(__dirname, "..", "teachersInfo.txt"); // Adjust the file path as needed
  const purpose = "assistants";

  try {
    // Upload the file
    const file = await openai.files.create({
      file: fs.createReadStream(filePath),
      purpose: purpose,
    });

    // Save the file ID
    const fileId = file.id;

    // Create and poll the vector store file
    const vectorStoreFile = await openai.beta.vectorStores.files.createAndPoll(
      "vs_5DPfGbeH32XVaSU2NQ0HwLrC", // Your vector store ID
      { file_id: fileId }
    );

    res.status(200).json(vectorStoreFile);
  } catch (error) {
    console.error("Error uploading file:", error);
    res
      .status(500)
      .json({ error: "Failed to upload file and add to vector store" });
  }
});

export default router;
