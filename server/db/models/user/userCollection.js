import db from "../../connection.js";
const userCollection = db.collection("users");

export const createUser = async (userData) => {
  try {
    const newUser = {
      _id: userData.firebaseUserId, // Use Firebase ID as MongoDB document ID
      firstName: userData.firstName,
      lastName: userData.lastName,
      userType: userData.userType,
      about: userData.about,
      availability: userData.availability, // Include availability
    };
    const result = await userCollection.insertOne(newUser);
    return result;
  } catch (error) {
    throw new Error("Error creating a new user: " + error.message);
  }
};

export const findUserByFirebaseId = async (firebaseUserId) => {
  try {
    const user = await userCollection.findOne({ _id: firebaseUserId });
    return user;
  } catch (error) {
    throw new Error("Error finding user: " + error.message);
  }
};
