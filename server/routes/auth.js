import express from "express";
import { getSignupAccessByEmail } from "../db/models/signupAccess/signupAccessServices.js";
import { addUser } from "../db/models/user/userServices.js";
import { getUserByFirebaseId } from "../db/models/user/userServices.js";
import admin from "firebase-admin";

const router = express.Router();

// Login endpoint
router.post("/login", async (req, res) => {
  const { token } = req.body;
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  try {
    // Create the session cookie. This will also verify the ID token in the process.
    const sessionCookie = await admin
      .auth()
      .createSessionCookie(token, { expiresIn });

    // Set cookie options
    const options = {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: "Lax",
    };

    // Set the session cookie
    res.cookie("session", sessionCookie, options);
    // Verify the ID token to get user info
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;
    const email = decodedToken.email;
    const name = decodedToken.name;

    // Check if user already exists in your database
    let user = await getUserByFirebaseId(userId);

    if (!user) {
      // Determine userType
      const userType = await getSignupAccessByEmail(email);

      user = {
        userId,
        name,
        userType,
        email,
      };
      console.log("Adding user to database");
      const userResponse = await addUser(user);
      console.log("User Response: ", userResponse);
      res.status(200).send({ userData: user, isNewUser: true });
    } else {
      // Else, user already exists in database
      console.log("User already exists in database: ", user);
      res.status(200).send({ userData: user, isNewUser: false });
    }
  } catch (error) {
    console.error("Error creating session cookie:", error);
    res.status(401).send({ error: "Invalid token" });
  }
});

// Logout endpoint
router.post("/logout", (req, res) => {
  res.clearCookie("session");
  res.status(200).send({ message: "Logged out successfully" });
});

// Check authentication endpoint
router.get("/check", async (req, res) => {
  const sessionCookie = req.cookies.session;

  if (!sessionCookie) {
    // No session cookie, user is not authenticated
    console.log("No session cookie found, user not authenticated");
    return res.status(401).send({ error: "Unauthorized" });
  }

  console.log("Session cookie:", sessionCookie);

  try {
    const decodedToken = await admin
      .auth()
      .verifySessionCookie(sessionCookie, true);

    console.log("Decoded token:", decodedToken);

    // Fetch additional user data from your database if needed
    const userId = decodedToken.uid;
    // Assuming you have a function getUserByFirebaseId
    const user = await getUserByFirebaseId(userId);

    if (!user) {
      console.log("User not found in database");
      return res.status(404).send({ error: "User not found" });
    }

    console.log("User found:", user);
    res.status(200).send(user);
  } catch (error) {
    console.error("Failed to verify session cookie:", error);
    res.status(401).send({ error: "Unauthorized" });
  }
});

export default router;
