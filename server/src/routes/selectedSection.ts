/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import { CustomRequest } from "../types/express";
import {
  deleteSelectedSection,
  postSelectedSection,
} from "../db/models/selectedSection/selectedSectionServices";
import { getSelectedSectionsByUserId } from "../db/models/selectedSection/selectedSectionServices";
import { environment } from "../index";
import { CourseTerm } from "@polylink/shared/types";
const router = express.Router();

router.get("/:term", async (req: any, res: any) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const selectedSections = await getSelectedSectionsByUserId(
      userId,
      req.params.term as CourseTerm
    );

    return res.status(200).json({
      message: "Selected sections fetched successfully",
      selectedSections,
    });
  } catch (error) {
    if (environment === "dev") {
      console.error("Error fetching sections:", error);
    }
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
    if (environment === "dev") {
      console.error("Error creating or updating selected section:", error);
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/:term/:sectionId", async (req, res: any) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { term, sectionId } = req.params;
    const { selectedSections, message } = await deleteSelectedSection(
      userId,
      sectionId,
      term as CourseTerm
    );

    res.status(200).json({
      message,
      selectedSections,
    });
  } catch (error) {
    if (environment === "dev") {
      console.error("Error removing section:", error);
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
