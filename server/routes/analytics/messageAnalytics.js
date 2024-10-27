import express from "express";
// import {} from "../db/models/user/userServices.js";
import { authorizeRoles } from "../../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/", authorizeRoles(["admin"]), async (req, res) => {
  try {
    // const messages = await getMessages();
    res.status(200).send("Messages set up successfully");
  } catch (error) {
    res.status(500).send("Failed to get messages: " + error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const { userMessageId, botMessageId, logId, assistantId, hadFile } =
      req.body;
    const createdAt = Date.now();
    // Create message analytics in db
    // still need to add responseTime, inputMessage, outputMessage, tokensUsed after message stream is completed
    // user can also update this data by adding userReaction
    res.status(200).send("Message created successfully");
  } catch (error) {
    res.status(500).send("Failed to create message: " + error.message);
  }
});

export default router;
