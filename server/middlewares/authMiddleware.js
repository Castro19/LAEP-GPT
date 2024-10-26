import admin from "firebase-admin";
import { getUserByFirebaseId } from "../db/models/user/userServices.js";
export const authenticate = async (req, res, next) => {
  const sessionCookie = req.cookies.session || "";

  try {
    // Verify the session cookie
    const decodedToken = await admin
      .auth()
      .verifySessionCookie(sessionCookie, true);
    req.user = decodedToken;
    // Set the user role
    const user = await getUserByFirebaseId(decodedToken.uid);
    req.user.role = user.userType;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).send("Unauthorized");
  }
};

export const authorizeRoles = (allowedRoles) => (req, res, next) => {
  const userRole = req.user.role;
  if (allowedRoles.includes(userRole)) {
    next();
  } else {
    res
      .status(403)
      .send("Forbidden: You do not have the required permissions.");
  }
};
