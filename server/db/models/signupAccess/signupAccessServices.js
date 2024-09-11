import db from "../../connection.js";

const signupAccessCollection = db.collection("signupAccess");

export const getSignupAccessByEmail = async (email) => {
  try {
    const signupAccessEntry = await signupAccessCollection.findOne({ email });
    return signupAccessEntry;
  } catch (error) {
    throw new Error("Error retrieving signup access entry: " + error.message);
  }
};
