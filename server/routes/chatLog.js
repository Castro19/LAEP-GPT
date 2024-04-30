import express from "express";

const router = express.Router();

// Test: Access here `http://localhost:4000/chatLogs`
router.get("/", async (req, res) => {
  res.send("ChatLog Backend Working");
});

// Creating a new Log: (Create)
router.post("/", async (req, res) => {
  try {
    const { currentChatId, firebaseUserId, title, content, timestamp } =
      req.body;
    if (!firebaseUserId) {
      return res.status(400).send("Firebase User ID is required");
    }
    const newLog = {
      _id: currentChatId,
      userId: firebaseUserId,
      title: title,
    };
    console.log("---------Creating the Log--------");
    console.log("Chat ID: ", currentChatId);
    console.log("Firebase User ID: ", firebaseUserId);
    console.log("Title: ", title);
    console.log("Content: ", content);
    console.log("Timestamp: ", timestamp);
    res.status(201).json({ isWorking: true });
  } catch (error) {
    res.status(500).send("Failed to create user: " + error.message);
    console.error("Failed to create user: ", error);
  }
});

// Get the entire LogList: (Read)
router.get("/:userId", async (req, res) => {
  res.send("Backend for ChatLog LogList UserID is working!");
});

// Retreive a specific Log: (Read)
// FIX: Add in check for authorization
router.get("/:userId/:logId", async (req, res) => {
  console.log(`Fetching log ${req.params.logId} for user ${req.params.userId}`);
  res.status(200).send(`Log ${req.params.logId} for user ${req.params.userId}`);
});

// Updating a Log: (Update)
router.put("/", async (req, res) => {
  const { logId, firebaseUserId, content, timestamp } = req.body;
  console.log("-----Updating the Log-------");
  // console.log(
  // `Updating log ${req.params.logId} for user ${req.params.firebaseUserId}`
  // );
  console.log("Log ID: ", logId);
  console.log("Firebase User ID: ", firebaseUserId);
  console.log("Content: ", content);
  console.log("Timestamp: ", timestamp);
  res.status(200);
  // .send(`Updated log ${req.params.logId} for user ${req.params.userId}`);
});

// Deleting a Log
router.delete("/:userId/:logId", async (req, res) => {
  console.log(`Deleting log ${req.params.logId} for user ${req.params.userId}`);
  res.status(204).send(); // 204 No Content is typical for a delete operation.
});

export default router;
