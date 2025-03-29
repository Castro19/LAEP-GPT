import { getUserByFirebaseId } from "../../db/models/user/userServices";
import { Response } from "express";

async function isUnauthorized(userId: string, res: Response): Promise<boolean> {
  // check if user exists in database
  if (!userId) {
    res.status(401).end("Unauthorized");
    return true;
  } else {
    const user = await getUserByFirebaseId(userId);
    if (!user) {
      res.status(401).end("Unauthorized");
      return true;
    }
  }
  return false;
}

export { isUnauthorized };
