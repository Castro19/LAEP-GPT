import express, { Request, Response, RequestHandler } from "express";
import {
  createSignupAccess,
  getSignupAccessByEmail,
} from "../db/models/signupAccess/signupAccessServices";
import {
  addUser,
  checkUserExistsByEmail,
  updateUser,
} from "../db/models/user/userServices";
import { getUserByFirebaseId } from "../db/models/user/userServices";
import admin from "firebase-admin";
import { UserData } from "@polylink/shared/types";
import { byPassCalPolyEmailCheck } from "../db/models/signupAccess/signupAccessServices";
import { verifyCalPolyEmail } from "../helpers/auth/verifyValidEmail";
import { environment } from "../index";

const router = express.Router();

// Login endpoint
router.post("/login", async (req, res) => {
  const { token, secretPassphrase } = req.body;
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
    const userEmail = decodedToken.email || "";

    const validEmail = await verifyCalPolyEmail(userEmail);

    if (!validEmail) {
      res.status(401).send({ error: "Invalid email" });
      return;
    }
    // Check if user already exists in your database
    const user = await getUserByFirebaseId(userId);

    if (!user) {
      // Determine userType
      const email = decodedToken.email || "";
      // Check for display name in different possible locations in the token
      const name =
        decodedToken.name ||
        decodedToken.displayName ||
        (decodedToken.firebase && decodedToken.firebase.displayName) ||
        "";
      const userType = await getSignupAccessByEmail(email);
      // Microsoft login is also email verified
      const emailVerified =
        decodedToken.email_verified ||
        decodedToken.firebase.sign_in_provider === "microsoft.com" ||
        secretPassphrase === "Mustangs"; // Bypass email verification for incoming students

      const userData: UserData = {
        userId,
        name,
        userType: userType as "student" | "admin",
        email,
        emailVerified,
        canShareData: false,
        availability: {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
          Saturday: [],
          Sunday: [],
        },
        bio: "",
        year: "freshman",
        demographic: {
          gender: "",
          ethnicity: "",
        },
        interestAreas: [],
        preferredActivities: [],
        goals: [],
        flowchartInformation: {
          flowchartId: "",
          startingYear: "",
          catalog: "",
          major: "",
          concentration: "",
        },
        isIncoming: secretPassphrase === "Mustangs",
      };
      await addUser(userData);

      res.status(200).send({ userData: userData, isNewUser: true });
    } else {
      // Else, user already exists in database
      res.status(200).send({ userData: user, isNewUser: false });
    }
  } catch (error) {
    if (environment === "dev") {
      console.error("Error creating session cookie:", error);
    }
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
      return res.status(404).send({ error: "User not found" });
    }

    if (!user.emailVerified && decodedToken.email_verified) {
      await updateUser(user.userId, { emailVerified: true });
    }

    res.status(200).send(user);
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to verify session cookie:", error);
    }
    res.status(401).send({ error: "Unauthorized" });
  }
}) as RequestHandler);

router.post("/check-email", async (req: Request, res: Response) => {
  const { email } = JSON.parse(req.body);

  try {
    const userExists = await checkUserExistsByEmail(email);
    res.status(200).send({ userExists });
  } catch (error) {
    if (environment === "dev") {
      console.error("Error checking email: ", error);
    }
    res.status(500).send({ error: "Internal server error" });
  }
});

router.post(
  "/can-bypass-calpoly-email-check",
  async (req: Request, res: Response) => {
    let email: string;
    if (typeof req.body === "string") {
      email = JSON.parse(req.body).email;
    } else {
      email = req.body.email;
    }
    try {
      const byPass = await byPassCalPolyEmailCheck(email);
      res.status(200).send({ byPass });
    } catch (error) {
      if (environment === "dev") {
        console.error("Error checking email: ", error);
      }
      res.status(500).send({ error: "Internal server error" });
    }
  }
);

router.post("/create-signup-access", async (req: Request, res: Response) => {
  const { email, role } = req.body;
  await createSignupAccess(email, role);
  res.status(200).send({ message: "Signup access created" });
});

// Endpoint to update user's display name in Firebase Admin SDK
router.post("/update-display-name", (async (req: Request, res: Response) => {
  const { userId, displayName } = req.body;

  if (!userId || !displayName) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  try {
    await admin.auth().updateUser(userId, {
      displayName: displayName,
    });

    res.status(200).send({ message: "Display name updated successfully" });
  } catch (error) {
    if (environment === "dev") {
      console.error("Error updating display name:", error);
    }
    res.status(500).send({ error: "Failed to update display name" });
  }
}) as RequestHandler);

export default router;
