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
} from "../db/models/calendar/calendarListServices";

const router = express.Router();

router.get("/", async (req: CustomRequest, res: any) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { schedules, primaryCalendarId } =
      await getScheduleListByUserId(userId);

    return res.status(200).json({
      message: "Schedules fetched successfully",
      schedules,
      primaryCalendarId,
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
    const { sections } = req.body;
    const result = await createOrUpdateSchedule(userId, sections);
    return res.status(200).json({
      message: "Schedule created or updated successfully",
      schedules: result.schedules,
      primaryCalendarId: result.primaryCalendarId,
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
    const { schedule, primaryCalendarId, name } = req.body;
    const result = await updateScheduleListItem({
      userId,
      scheduleId,
      schedule,
      primaryCalendarId,
      name,
    });
    return res.status(200).json({
      message: "Schedule updated successfully",
      schedules: result.schedules,
      primaryCalendarId: result.primaryCalendarId,
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
    const { schedules, primaryCalendarId } = await deleteScheduleItem(
      userId,
      scheduleId
    );

    res.status(200).json({
      message: "Schedule deleted successfully",
      schedules,
      primaryCalendarId,
    });
  } catch (error) {
    if (environment === "dev") {
      console.error("Error removing schedule:", error);
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
export default router;
