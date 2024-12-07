import express, { RequestHandler } from "express";
import {
  createMessageAnalytics,
  updateMessageAnalytics,
  updateMessageAnalyticsReaction,
} from "../../db/models/analytics/messageAnalytics/messageAnalyticsServices";
import { MessageAnalyticsCreate } from "@polylink/shared/types";

const router = express.Router();

router.get("/test", async (req, res) => {
  res.status(200).send("Message analytics route");
});
// Create message analytics in db
router.post("/", (async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).send("No user found in request");
    }
    const userData = req.body;
    const messageAnalyticsData = {
      _id: userData.userMessageId,
      userId,
      ...userData,
    };
    // still need to add responseTime, inputMessage, outputMessage, tokensUsed, and completed_at after message stream is completed
    // user can also update this data by adding userReaction

    await createMessageAnalytics(
      messageAnalyticsData as MessageAnalyticsCreate
    );
    res.status(200).send("Message created successfully");
  } catch (error) {
    res
      .status(500)
      .send("Failed to create message: " + (error as Error).message);
  }
}) as RequestHandler);

router.put("/", (async (req, res) => {
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
    res
      .status(500)
      .send("Failed to update message: " + (error as Error).message);
  }
}) as RequestHandler);

router.put("/reaction", (async (req, res) => {
  try {
    const { botMessageId, userReaction } = req.body;
    if (!botMessageId) {
      return res.status(400).send("botMessageId is required");
    }
    await updateMessageAnalyticsReaction(botMessageId, userReaction);
    res.status(200).send("Message updated successfully");
  } catch (error) {
    res
      .status(500)
      .send("Failed to update message: " + (error as Error).message);
  }
}) as RequestHandler);
export default router;
