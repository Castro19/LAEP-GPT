/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import { CustomRequest } from "../types/express";
import { postSelectedSection } from "../db/models/selectedSection/sectionServices";
import { getSelectedSectionsByUserId } from "../db/models/selectedSection/sectionServices";

const router = express.Router();

router.get("/", async (req: CustomRequest, res: any) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const selectedSections = await getSelectedSectionsByUserId(userId);
    console.log("SELECTED SECTIONS", selectedSections);
    return res.status(200).json({
      message: "Selected sections fetched successfully",
      selectedSections,
    });
  } catch (error) {
    console.error("Error fetching sections:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/", async (req, res: any) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { section } = req.body;
    const { selectedSections, message } = await postSelectedSection(
      userId,
      section
    );
    return res.status(200).json({
      message,
      selectedSections,
    });
  } catch (error) {
    console.error("Error creating or updating selected section:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
