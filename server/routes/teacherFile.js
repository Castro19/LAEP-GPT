import express from "express";
import { generateTeacherFile } from "../generateTeacherFile.js";

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("POST request received for generateTeacherFile");

  try {
    await generateTeacherFile();
    res.status(200).json({ message: "Teacher file generated successfully." });
  } catch (error) {
    console.error("Error generating teacher file:", error);
    res.status(500).json({ error: "Error generating teacher file" });
  }
});

export default router;
