import * as UserModel from "./userModel.js";

export const addUser = async (userData) => {
  try {
    console.log("USer data: ", userData);
    const result = await UserModel.createUser(userData);
    return { message: "User created successfully", userId: result.insertedId };
  } catch (error) {
    throw new Error("Service error: " + error.message);
  }
};
