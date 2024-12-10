import { Collection } from "mongodb";
import { getDb } from "../../connection";

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
    console.error("Error getting signup access by email:", error);
    return "student";
  }
};
