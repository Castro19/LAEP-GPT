import express from "express";
import { addUser } from "../db/models/user/userServices.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.send("User Route working!");
  } catch (error) {
    res.status(500).send("An error occurred while retreiving the user data.");
    console.error("Failed to get user: ", error);
  }
});

router.get("/signup", async (req, res) => {
  res.send("User signup route working");
});

router.post("/signup", async (req, res) => {
  try {
    const { firebaseUserId, firstName, lastName } = req.body;
    if (!firebaseUserId) {
      return res.status(400).send("Firebase User ID is required");
    }
    const result = await addUser({ firebaseUserId, firstName, lastName });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send("Failed to create user: " + error.message);
    console.error("Failed to create user: ", error);
  }
});

export default router;
