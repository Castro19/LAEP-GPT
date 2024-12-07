import { openai } from "../../index.js";
import fs from "fs";
import { FileObject } from "openai/resources/index.mjs";
import path from "path";

/**
 * Temporary function to store the file on the local file system.
 * @param {Object} file - The uploaded file object (e.g., from a form submission via Multer).
 * @returns {string} - The path to the saved file on the local machine.
 */
export async function saveFileLocally(
  file: Express.Multer.File
): Promise<string> {
  const uploadDir = "src/uploads";
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir); // Create the uploads directory if it doesn't exist
  }

  // Use the file path provided by Multer (file.path)
  const tempFilePath = file.path; // This is where Multer saves the file temporarily
  const newFilePath = path.join(uploadDir, file.originalname); // Save to the uploads folder

  // Move the file from Multer's temporary location to the final destination
  fs.renameSync(tempFilePath, newFilePath); // Move the file

  return newFilePath; // Return the new file path
}

/**
 * Example: Handle file upload, save it locally, and then upload it to OpenAI.
 * @param {Object} file - The uploaded file object from the form submission.
 */
export async function handleFileUpload(
  file: Express.Multer.File
): Promise<FileObject> {
  try {
    // Step 1: Save the file locally
    const localFilePath = await saveFileLocally(file);

    // Step 2: Upload the local file to OpenAI
    const openAIResponse = await uploadFileToOpenAI(localFilePath);

    fs.unlinkSync(localFilePath); // Clean up local file after upload

    return openAIResponse;
  } catch (error) {
    console.error("Error handling file upload:", error);
    throw error;
  }
}

/**
 * Function to upload file to OpenAI API
 * @param {string} filePath - The local file path of the file to be uploaded
 */
async function uploadFileToOpenAI(filePath: string): Promise<FileObject> {
  try {
    const fileStream = fs.createReadStream(filePath); // Create a file stream from the local file

    // Upload the file stream to OpenAI
    const userFile = await openai.files.create({
      file: fileStream,
      purpose: "assistants", // Replace this purpose as per your requirement
    });

    return userFile;
  } catch (error) {
    console.error("Error uploading file to OpenAI:", error);
    throw error;
  }
}
