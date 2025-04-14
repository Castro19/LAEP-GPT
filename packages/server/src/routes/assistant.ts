import express, { RequestHandler } from "express";
import {
  fetchAssistants,
  getTestModeAssistants,
} from "../db/models/assistant/assistantServices";
import { getUserByFirebaseId } from "../db/models/user/userServices";
import { environment } from "..";

const router = express.Router();

// Read: Get all GPTs
router.get("/", (async (req, res) => {
  const userId = req.user?.uid;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await getUserByFirebaseId(userId);
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  let result;
  try {
    if (user.userType === "admin") {
      result = await getTestModeAssistants();
    } else {
      result = await fetchAssistants();
    }
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to fetch GPTs: ", error);
    }
    return res.status(500).json({ message: "Internal server error" });
  }

  res.status(200).json(result);
}) as RequestHandler);

export default router;
