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
    const {
      firebaseUserId,
      firstName,
      lastName,
      userType,
      about,
      availability,
    } = req.body;
    if (!firebaseUserId) {
      return res.status(400).send("Firebase User ID is required");
    }
    const result = await addUser({
      firebaseUserId,
      firstName,
      lastName,
      userType,
      about,
      availability,
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send("Failed to create user: " + error.message);
    console.error("Failed to create user: ", error);
  }
});

// Route to get a specific user by Firebase ID
router.get("/:firebaseUserId", async (req, res) => {
  try {
    const { firebaseUserId } = req.params;
    const user = await getUserByFirebaseId(firebaseUserId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send("Failed to get user: " + error.message);
  }
});

// Route to update a specific user by Firebase ID
router.put("/:firebaseUserId", async (req, res) => {
  try {
    const { firebaseUserId } = req.params;
    const updateData = req.body; // Contains the updated fields
    const updatedUser = await updateUser(firebaseUserId, updateData);
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
