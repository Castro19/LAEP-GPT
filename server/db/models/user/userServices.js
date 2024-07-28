import * as UserModel from "./userCollection.js";

export const addUser = async (userData) => {
  try {
    console.log("User data: ", userData);
    const result = await UserModel.createUser(userData);
    return { message: "User created successfully", userId: result.insertedId };
  } catch (error) {
    throw new Error("Service error: " + error.message);
  }
};