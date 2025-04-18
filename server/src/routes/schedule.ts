/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import { CustomRequest } from "../types/express";
import { environment } from "../index";
import {
  getScheduleListByUserId,
  createOrUpdateSchedule,
  deleteScheduleItem,
  getScheduleById,
  updateScheduleListItem,
} from "../db/models/schedule/scheduleServices";
import { CourseTerm } from "@polylink/shared/types";

const router = express.Router();

const VALID_TERMS = ["spring2025", "summer2025"] as const;

router.get("/", async (req: CustomRequest, res: any) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { term } = req.query;
    if (!term || !VALID_TERMS.includes(term as CourseTerm)) {
      return res.status(400).json({ message: "Invalid term" });
    }
    const { schedules, primaryScheduleId } = await getScheduleListByUserId(
      userId,
      term as CourseTerm
    );

    return res.status(200).json({
      message: "Schedules fetched successfully",
      schedules,
      primaryScheduleId,
    });
  } catch (error) {
    if (environment === "dev") {
      console.error("Error fetching schedules:", error);
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
    const { sections, term } = req.body;
    if (!term || !VALID_TERMS.includes(term)) {
      return res.status(400).json({ message: "Invalid term" });
    }
    const result = await createOrUpdateSchedule(userId, sections, term);
    return res.status(200).json({
      message: "Schedule created or updated successfully",
      schedules: result.schedules,
      primaryScheduleId: result.primaryScheduleId,
    });
  } catch (error) {
    if (environment === "dev") {
      console.error("Error creating or updating schedule:", error);
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:scheduleId", async (req, res: any) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { scheduleId } = req.params;
    const result = await getScheduleById(userId, scheduleId);
    if (!result) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    return res.status(200).json({
      message: "Schedule fetched successfully",
      schedule: result,
    });
  } catch (error) {
    if (environment === "dev") {
      console.error("Error fetching schedule:", error);
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/:scheduleId", async (req, res: any) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { scheduleId } = req.params;
    const { primaryScheduleId, name, term } = req.body;
    if (!term || !VALID_TERMS.includes(term)) {
      return res.status(400).json({ message: "Invalid term" });
    }
    const result = await updateScheduleListItem({
      userId,
      scheduleId,
      primaryScheduleId,
      name,
      term,
    });
    return res.status(200).json({
      message: "Schedule updated successfully",
      schedules: result.schedules,
      primaryScheduleId: result.primaryScheduleId,
    });
  } catch (error) {
    if (environment === "dev") {
      console.error("Error updating schedule:", error);
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/:scheduleId", async (req, res: any) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { scheduleId } = req.params;
    const { term } = req.query;
    if (!term || !VALID_TERMS.includes(term as CourseTerm)) {
      return res.status(400).json({ message: "Invalid term" });
    }
    const { schedules, primaryScheduleId } = await deleteScheduleItem(
      userId,
      scheduleId,
      term as CourseTerm
    );

    res.status(200).json({
      message: "Schedule deleted successfully",
      schedules,
      primaryScheduleId,
    });
  } catch (error) {
    if (environment === "dev") {
      console.error("Error removing schedule:", error);
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
export default router;
