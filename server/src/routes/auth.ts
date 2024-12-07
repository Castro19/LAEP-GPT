import express, { Request, Response, RequestHandler } from "express";
import { getSignupAccessByEmail } from "../db/models/signupAccess/signupAccessServices";
import { addUser } from "../db/models/user/userServices";
import { getUserByFirebaseId } from "../db/models/user/userServices";
import admin from "firebase-admin";
import { UserData } from "@polylink/shared/types";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello W");
});

// Login endpoint
router.post("/login", async (req, res) => {
  const { token } = req.body;
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  try {
    // Create the session cookie. This will also verify the ID token in the process.
    const sessionCookie = await admin
      .auth()
      .createSessionCookie(token, { expiresIn });

    // Set the session cookie
    res.cookie("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Verify the ID token to get user info
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;
    const email = decodedToken.email || "";
    const name = decodedToken.name || "";

    // Check if user already exists in your database
    const user = await getUserByFirebaseId(userId);

    if (!user) {
      // Determine userType
      const userType = await getSignupAccessByEmail(email);

      const userData: UserData = {
        userId,
        name,
        userType: userType as "student" | "admin",
        email,
        bio: "",
        year: "",
        interests: [],
        courses: [],
        availability: {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
          Saturday: [],
          Sunday: [],
        },
        canShareData: false,
        startingYear: "",
        catalog: "",
        major: "",
        concentration: "",
        flowchartId: "",
      };
      console.log("Adding user to database");
      await addUser(userData);

      res.status(200).send({ userData: userData, isNewUser: true });
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
router.get("/check", (async (req: Request, res: Response) => {
  const sessionCookie = req.cookies.session;

  if (!sessionCookie) {
    // No session cookie, user is not authenticated
    console.log("No session cookie found, user not authenticated");
    return res.status(401).send({ error: "Unauthorized" });
  }

  try {
    const decodedToken = await admin
      .auth()
      .verifySessionCookie(sessionCookie, true);

    // Fetch additional user data from your database if needed
    const userId = decodedToken.uid;
    const user = await getUserByFirebaseId(userId);

    if (!user) {
      console.log("User not found in database");
      return res.status(404).send({ error: "User not found" });
    }

    res.status(200).send(user);
  } catch (error) {
    console.error("Failed to verify session cookie:", error);
    res.status(401).send({ error: "Unauthorized" });
  }
}) as RequestHandler);

export default router;
