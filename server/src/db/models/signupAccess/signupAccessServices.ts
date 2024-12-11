import { Collection } from "mongodb";
import { getDb } from "../../connection";
import { environment } from "../../../index";

let signupAccessCollection: Collection;

// Function to initialize the collection
const initializeCollection = (): void => {
  signupAccessCollection = getDb().collection("signupAccess");
};

export const getSignupAccessByEmail = async (
  email: string
): Promise<string> => {
  if (!signupAccessCollection) initializeCollection();
  try {
    const signupAccessEntry = await signupAccessCollection.findOne({ email });
    if (signupAccessEntry) {
      return signupAccessEntry.role;
    }
    const defaultRole = "student";
    return defaultRole;
  } catch (error) {
    if (environment === "dev") {
      console.error("Error getting signup access by email:", error);
    }
    return "student";
  }
};

export const byPassCalPolyEmailCheck = async (
  email: string
): Promise<boolean> => {
  if (!signupAccessCollection) initializeCollection();
  try {
    const signupAccessEntry = await signupAccessCollection.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });
    if (signupAccessEntry) {
      return true;
    }
    return false;
  } catch (error) {
    if (environment === "dev") {
      console.error("Error getting signup access by email:", error);
    }
    return false;
  }
};
