/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import { CustomRequest } from "../types/express";
import { environment } from "../index";
import { getCalendarsByUserId } from "../db/models/calendar/calendarServices";
import {
  createOrUpdateCalendar,
  deleteCalendar,
} from "../db/models/calendar/calendarServices";
const router = express.Router();

router.get("/", async (req: CustomRequest, res: any) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { calendars, primaryCalendarId } = await getCalendarsByUserId(userId);

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
    const result = await createOrUpdateCalendar(userId, sections);
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

router.delete("/:calendarId", async (req, res: any) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { calendarId } = req.params;
    const { calendars, primaryCalendarId } = await deleteCalendar(
      userId,
      parseInt(calendarId)
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
