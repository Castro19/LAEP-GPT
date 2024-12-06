import express from "express";
// import {} from "../db/models/user/userServices.js";
import { authorizeRoles } from "../../middlewares/authMiddleware.js";
import {
  createMessageAnalytics,
  updateMessageAnalytics,
  updateMessageAnalyticsReaction,
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
      _id: userData.userMessageId,
      userId,
      ...userData,
    };
    // still need to add responseTime, inputMessage, outputMessage, tokensUsed, and completed_at after message stream is completed
    // user can also update this data by adding userReaction

    await createMessageAnalytics(messageAnalyticsData);
    res.status(200).send("Message created successfully");
  } catch (error) {
    res.status(500).send("Failed to create message: " + error.message);
  }
});

router.put("/", async (req, res) => {
  try {
    const { userMessageId, userMessage, createdAt, hadError, errorMessage } =
      req.body;
    if (!userMessageId) {
      return res.status(400).send("userMessageId is required");
    }
    // Convert dates to numbers and calculate response time
    const finishedAt = new Date();
    const startTime = new Date(createdAt).getTime();
    const endTime = new Date(finishedAt).getTime();
    const responseTime = (endTime - startTime) / 1000;

    await updateMessageAnalytics(userMessageId, {
      userMessage,
      responseTime,
      finishedAt,
      hadError,
      errorMessage,
    });
    res.status(200).send("Message updated successfully");
  } catch (error) {
    res.status(500).send("Failed to update message: " + error.message);
  }
});

router.put("/reaction", async (req, res) => {
  try {
    const { botMessageId, userReaction } = req.body;
    if (!botMessageId) {
      return res.status(400).send("botMessageId is required");
    }
    await updateMessageAnalyticsReaction(botMessageId, userReaction);
    res.status(200).send("Message updated successfully");
  } catch (error) {
    res.status(500).send("Failed to update message: " + error.message);
  }
});
export default router;
