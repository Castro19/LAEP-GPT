import db from "../../connection.js";

const userCollection = db.collection("users");

export const createUser = async (userData) => {
  try {
    const newUser = {
      _id: userData.userId, // Use Firebase ID as MongoDB document ID
      name: userData.name,
      // User Type is set to student by default
      // userType: "student",
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
    console.log("User found: ", user);
    return user;
  } catch (error) {
    throw new Error("Error finding user: " + error.message);
  }
};

export const updateUserByFirebaseId = async (firebaseUserId, updateData) => {
  try {
    const result = await userCollection.updateOne(
      { _id: firebaseUserId },
      { $set: updateData }
    );
    return result;
  } catch (error) {
    throw new Error("Error updating user: " + error.message);
  }
};

// Add the function to find all users
export const findAllUsers = async () => {
  try {
    const users = await userCollection.find({}).toArray();
    return users;
  } catch (error) {
    throw new Error("Error retrieving all users: " + error.message);
  }
};
