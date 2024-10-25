import db from "../../connection.js";

const signupAccessCollection = db.collection("signupAccess");

export const getSignupAccessByEmail = async (email) => {
  try {
    const signupAccessEntry = await signupAccessCollection.findOne({ email });
    return signupAccessEntry.role;
  } catch (error) {
    console.log("No sign up access entry found");
    const defaultRole = "student";
    return defaultRole;
  }
};
