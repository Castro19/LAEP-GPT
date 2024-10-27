import express from "express";
// import {} from "../db/models/user/userServices.js";
import { authorizeRoles } from "../../middlewares/authMiddleware.js";
import {
  createMessageAnalytics,
  updateMessageAnalytics,
} from "../../db/models/analytics/messageAnalytics/messageAnalyticsServices.js";
const router = express.Router();

router.get("/", authorizeRoles(["admin"]), async (req, res) => {
  try {
    // const messages = await getMessages();
    res.status(200).send("Messages set up successfully");
  } catch (error) {
    res.status(500).send("Failed to get messages: " + error.message);
  }
});
// Create message analytics in db
router.post("/", async (req, res) => {
  try {
    const userId = req.user.uid;
    const userData = req.body;
    const messageAnalyticsData = {
      _id: userData.botMessageId,
      userId,
      ...userData,
    };
    // still need to add responseTime, inputMessage, outputMessage, tokensUsed, and completed_at after message stream is completed
    // user can also update this data by adding userReaction

    const result = await createMessageAnalytics(
      userData.botMessageId,
      messageAnalyticsData
    );
    console.log("Result of Post: ", result);
    res.status(200).send("Message created successfully");
  } catch (error) {
    res.status(500).send("Failed to create message: " + error.message);
  }
});

router.put("/", async (req, res) => {
  console.log("Received data:", req.body); // Add this to check incoming data

  try {
    const { botMessageId, createdAt, hadError, errorMessage, userReaction } =
      req.body;
    if (!botMessageId) {
      return res.status(400).send("botMessageId is required");
    }

    // Updated Message Analytics after user reaction
    if (userReaction) {
      await updateMessageAnalytics(botMessageId, { userReaction });
      res.status(200).send("Message updated successfully");
      return;
    }
    // Convert dates to numbers and calculate response time
    const finishedAt = new Date();
    const startTime = new Date(createdAt).getTime();
    const endTime = new Date(finishedAt).getTime();
    const responseTime = (endTime - startTime) / 1000;

    const result = await updateMessageAnalytics(botMessageId, {
      responseTime,
      finishedAt,
      hadError,
      errorMessage,
    });

    console.log("Result of Update: ", result);
    res.status(200).send("Message updated successfully");
  } catch (error) {
    res.status(500).send("Failed to update message: " + error.message);
  }
});

export default router;