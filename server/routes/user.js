import express from "express";
import { addUser } from "../db/models/user/userServices.js";
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { firebaseUserId, firstName, lastName, userType, about } = req.body;
    console.log(
      "Received in /signup: ",
      { firebaseUserId, firstName, lastName, about },
      userType
    ); // Debugging line
    console.log("Received userType: ", userType);
    if (!firebaseUserId) {
      return res.status(400).send("Firebase User ID is required");
    }
    console.log(
      "user.js Passing to addUser: ",
      { firebaseUserId, firstName, lastName, about },
      userType
    ); // Debugging line
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

export default router;
