import admin from "firebase-admin";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { getUserByFirebaseId } from "../db/models/user/userServices";
import { UserType } from "@polylink/shared/types";
import { environment } from "../index";

// authMiddleware.ts
export const authenticate: RequestHandler = async (req, res, next) => {
  const sessionCookie = req.cookies?.session || "";
  try {
    const decodedToken = await admin
      .auth()
      .verifySessionCookie(sessionCookie, true);
    req.user = decodedToken;
    const user = await getUserByFirebaseId(decodedToken.uid);
    if (user) {
      req.user.role = user.userType;
    }
    next();
  } catch (error) {
    if (environment === "dev") {
      console.error("Authentication error:", error);
    }
    res.status(401).send("Unauthorized");
  }
};

export const authorizeRoles = (allowedRoles: UserType[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role;

    if (userRole && allowedRoles.includes(userRole)) {
      next();
    } else {
      res
        .status(403)
        .send("Forbidden: You do not have the required permissions.");
    }
  };
};
