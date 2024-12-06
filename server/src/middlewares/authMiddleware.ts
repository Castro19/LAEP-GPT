import admin from "firebase-admin";
import { Request, Response, NextFunction } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import { getUserByFirebaseId } from "../db/models/user/userServices";
import { UserType } from "../types";
import { AuthenticatedRequest } from "../types";

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const sessionCookie = req.cookies?.session || "";

  try {
    // Verify the session cookie
    const decodedToken: DecodedIdToken = await admin
      .auth()
      .verifySessionCookie(sessionCookie, true);

    req.user = decodedToken;
    // Set the user role
    const user = await getUserByFirebaseId(decodedToken.uid);
    if (req.user && user) {
      req.user.role = user.userType;
    }
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).send("Unauthorized");
  }
};

export const authorizeRoles = (allowedRoles: UserType) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    const userRole = req.user.role;

    if (userRole && allowedRoles.includes(userRole)) {
      next();
    } else {
      res
        .status(403)
        .send("Forbidden: You do not have the required permissions.");
    }
  };
};
