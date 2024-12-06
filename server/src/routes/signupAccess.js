import express from "express";
import { getSignupAccessByEmail } from "../db/models/signupAccess/signupAccessServices.js";

const router = express.Router();

// route to get a signup access entry by email
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).send("Email is required");
    }

    // fetch the signup access entry from the database
    const signupAccessEntry = await getSignupAccessByEmail(email);

    if (!signupAccessEntry) {
      return res.status(404).send("Signup access entry not found");
    }

    res.status(200).json(signupAccessEntry);
  } catch (error) {
    res
      .status(500)
      .send("Failed to retrieve signup access entry: " + error.message);
    console.error("Failed to retrieve signup access entry:", error);
  }
});

export default router;
