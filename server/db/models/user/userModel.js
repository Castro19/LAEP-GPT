import db from "../../connection.js";

const userCollection = db.collection("users");

export const createUser = async (userData) => {
  console.log("USER DATA on UserModeL: ", userData);
  try {
    const newUser = {
      _id: userData.firebaseUserId, // Use Firebase ID as MongoDB document ID
      firstName: userData.firstName,
      lastName: userData.lastName,
    };

    const result = await userCollection.insertOne(newUser);
    return result;
  } catch (error) {
    throw new Error("Error creating a new user: " + error.message);
  }
};
