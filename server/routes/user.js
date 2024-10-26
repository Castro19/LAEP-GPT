import express from "express";
import {
  getUserByFirebaseId,
  updateUser,
  getAllUsers,
} from "../db/models/user/userServices.js";

const router = express.Router();

// Route to get the authenticated user's data
router.get("/me", async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await getUserByFirebaseId(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).send("Failed to get user: " + error.message);
  }
});

// Route to update the authenticated user's data
router.put("/me", async (req, res) => {
  try {
    const userId = req.user.uid;
    const updateData = req.body; // Contains the updated fields

    const updatedUser = await updateUser(userId, updateData);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).send("Failed to update user: " + error.message);
  }
});

// Route to get all users (restricted to admins, for example)
router.get("/", async (req, res) => {
  try {
    // You might want to check if the user has admin privileges
    const users = await getAllUsers(); // Fetch all users from MongoDB
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send("Failed to get users: " + error.message);
  }
});

export default router;
