import express, { RequestHandler } from "express";
import {
  getUserByFirebaseId,
  updateUser,
  getAllUsers,
} from "../db/models/user/userServices";
import { authorizeRoles } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/test", (req, res) => {
  res.status(200).send("Hello World");
});

// Route to get the authenticated user's data
router.get("/me", (async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).send("No user found in request");
    }
    const user = await getUserByFirebaseId(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send("Failed to get user: " + (error as Error).message);
  }
}) as RequestHandler);

// Route to update the authenticated user's data
router.put("/me", (async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).send("No user found in request");
    }
    const updateData = req.body;
    const updatedUser = await updateUser(userId, updateData);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).send("Failed to update user: " + (error as Error).message);
  }
}) as RequestHandler);

// Route to get all users (admin only)
router.get("/", authorizeRoles("admin"), (async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send("Failed to get users: " + (error as Error).message);
  }
}) as RequestHandler);

export default router;
