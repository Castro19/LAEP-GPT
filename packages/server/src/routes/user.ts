import express, { RequestHandler } from "express";
import {
  getUserByFirebaseId,
  updateUser,
  getAllUsers,
} from "../db/models/user/userServices";
import { authorizeRoles } from "../middlewares/authMiddleware";

const router = express.Router();

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
    // get all props but the _id as the object
    const cleanUpdateData = Object.keys(updateData).filter(
      (key) => key !== "_id"
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateDataObject = cleanUpdateData.reduce((acc: any, key: string) => {
      acc[key] = updateData[key];
      return acc;
    }, {});

    const updatedUser = await updateUser(userId, updateDataObject);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).send("Failed to update user: " + (error as Error).message);
  }
}) as RequestHandler);

// Route to get all users (admin only)
router.get("/", authorizeRoles(["admin"]), (async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send("Failed to get users: " + (error as Error).message);
  }
}) as RequestHandler);

export default router;
