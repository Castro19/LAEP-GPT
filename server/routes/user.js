import express from "express";
import {
  addUser,
  getUserByFirebaseId,
} from "../db/models/user/userServices.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { firebaseUserId, firstName, lastName, userType, about } = req.body;
    if (!firebaseUserId) {
      return res.status(400).send("Firebase User ID is required");
    }
    const result = await addUser({
      firebaseUserId,
      firstName,
      lastName,
      userType,
      about,
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send("Failed to create user: " + error.message);
    console.error("Failed to create user: ", error);
  }
});

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

export default router;
