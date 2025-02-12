/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import { CustomRequest } from "../types/express";
import { environment } from "../index";
import {
  getCalendarListByUserId,
  createOrUpdateCalendarList,
  deleteCalendarItem,
  getCalendarById,
} from "../db/models/calendar/calendarListServices";
const router = express.Router();

router.get("/", async (req: CustomRequest, res: any) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { calendars, primaryCalendarId } =
      await getCalendarListByUserId(userId);

    return res.status(200).json({
      message: "Calendars fetched successfully",
      calendars,
      primaryCalendarId,
    });
  } catch (error) {
    if (environment === "dev") {
      console.error("Error fetching calendars:", error);
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
    const result = await createOrUpdateCalendarList(userId, sections);
    return res.status(200).json({
      message: "Calendar created or updated successfully",
      calendars: result.calendars,
      primaryCalendarId: result.primaryCalendarId,
    });
  } catch (error) {
    if (environment === "dev") {
      console.error("Error creating or updating calendar:", error);
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:calendarId", async (req, res: any) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { calendarId } = req.params;
    const result = await getCalendarById(userId, calendarId);
    if (!result) {
      return res.status(404).json({ message: "Calendar not found" });
    }
    return res.status(200).json({
      message: "Calendar fetched successfully",
      calendar: result,
    });
  } catch (error) {
    if (environment === "dev") {
      console.error("Error fetching calendar:", error);
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/:calendarId", async (req, res: any) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { calendarId } = req.params;
    const { calendars, primaryCalendarId } = await deleteCalendarItem(
      userId,
      calendarId
    );

    res.status(200).json({
      message: "Calendar deleted successfully",
      calendars,
      primaryCalendarId,
    });
  } catch (error) {
    if (environment === "dev") {
      console.error("Error removing calendar:", error);
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
export default router;
