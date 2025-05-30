/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import { environment } from "../index";
import {
  getSelectedSectionsByUserId,
  postSelectedSection,
  deleteSelectedSection,
  bulkPostSelectedSections,
} from "../db/models/selectedSection/selectedSectionServices";
import { CourseTerm, SelectedSectionItem } from "@polylink/shared/types";

const router = express.Router();

router.get("/:term", async (req, res: any) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { term } = req.params;
    const selectedSections = await getSelectedSectionsByUserId(
      userId,
      term as CourseTerm
    );
    return res.status(200).json({
      message: "Selected sections fetched successfully",
      selectedSections,
    });
  } catch (error) {
    if (environment === "dev") {
      console.error("Error fetching selected sections:", error);
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
    const { sectionId, term } = req.body as {
      sectionId: number;
      term: CourseTerm;
    };

    const { selectedSections, message } = await postSelectedSection(userId, {
      sectionId,
      term,
    });
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

// bulkPostSelectedSections
router.post("/bulk-add-selected-sections", async (req, res: any) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { sectionsToAdd } = req.body as {
      sectionsToAdd: SelectedSectionItem[];
    };

    const { selectedSections } = await bulkPostSelectedSections(
      userId,
      sectionsToAdd
    );

    return res.status(200).json({
      message: "Selected sections added successfully",
      selectedSections,
    });
  } catch (error) {
    if (environment === "dev") {
      console.error("Error adding selected sections:", error);
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
    const { selectedSections, message } = await deleteSelectedSection(userId, {
      sectionId: parseInt(sectionId),
      term: term as CourseTerm,
    });
    return res.status(200).json({
      message,
      selectedSections,
    });
  } catch (error) {
    if (environment === "dev") {
      console.error("Error removing selected section:", error);
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/bulk", async (req, res: any) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { sections, operation = "add" } = req.body as {
      sections: Array<{
        sectionId: number;
        term: CourseTerm;
      }>;
      operation?: "add" | "remove";
    };

    const { selectedSections, message } = await bulkPostSelectedSections(
      userId,
      sections,
      operation
    );
    return res.status(200).json({
      message,
      selectedSections,
    });
  } catch (error) {
    if (environment === "dev") {
      console.error("Error creating or updating selected sections:", error);
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
