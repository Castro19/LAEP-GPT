import express from "express";
import {
  addUser,
  getUserByFirebaseId,
  updateUser,
  getAllUsers,
} from "../db/models/user/userServices.js";

const router = express.Router();

// Route to add a new user
router.post("/signup", async (req, res) => {
  try {
    const { userId, name } = req.body;
    if (!userId) {
      return res.status(400).send("Firebase User ID is required");
    }
    console.log("USER ID: ", userId);
    // Check if user already exists
    const existingUser = await getUserByFirebaseId(userId);
    if (existingUser) {
      return res.status(200).send("User already exists");
    }

    console.log("Adding user to database");
    const result = await addUser({
      userId,
      name,
    });
    const userResponse = {
      ...result,
      isNewUser: true,
    };
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).send("Failed to create user: " + error.message);
    console.error("Failed to create user: ", error);
  }
});

// Route to get a specific user by Firebase ID
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await getUserByFirebaseId(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send("Failed to get user: " + error.message);
  }
});

// Route to update a specific user by Firebase ID
router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body; // Contains the updated fields
    const updatedUser = await updateUser(userId, updateData);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).send("Failed to update user: " + error.message);
  }
});

// Route to get all users
router.get("/", async (req, res) => {
  try {
    const users = await getAllUsers(); // Fetch all users from MongoDB
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send("Failed to get users: " + error.message);
  }
});

export default router;
