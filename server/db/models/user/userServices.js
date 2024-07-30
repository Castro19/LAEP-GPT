import * as UserModel from "./userCollection.js";

export const addUser = async (userData) => {
  try {
    const result = await UserModel.createUser(userData);
    return { message: "User created successfully", userId: result.insertedId };
  } catch (error) {
    throw new Error("Service error: " + error.message);
  }
};

export const getUserByFirebaseId = async (firebaseUserId) => {
  try {
    const user = await UserModel.findUserByFirebaseId(firebaseUserId);
    return user;
  } catch (error) {
    throw new Error("Service error: " + error.message);
  }
};
