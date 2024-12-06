import {
  UpdateUserData,
  UserData,
  UserDataWithId,
} from "../../../types/index.js";
import * as UserModel from "./userCollection.js";

export const addUser = async (userData: UserData) => {
  try {
    // Find whether the role of the user
    const result = await UserModel.createUser(userData);
    return { message: "User created successfully", userId: result.insertedId };
  } catch (error: unknown) {
    throw new Error("Service error: " + (error as Error).message);
  }
};

export const getUserByFirebaseId = async (firebaseUserId: string) => {
  try {
    const user = await UserModel.findUserByFirebaseId(firebaseUserId);
    if (!user) {
      return null;
    }
    return user as UserData;
  } catch (error: unknown) {
    throw new Error("Service error: " + (error as Error).message);
  }
};

export const updateUser = async (
  firebaseUserId: string,
  updateData: UpdateUserData
) => {
  try {
    const result = await UserModel.updateUserByFirebaseId(
      firebaseUserId,
      updateData
    );
    return result;
  } catch (error: unknown) {
    throw new Error("Service error: " + (error as Error).message);
  }
};

// Add the function to get all users
export const getAllUsers = async () => {
  try {
    const users = await UserModel.findAllUsers();
    return users;
  } catch (error: unknown) {
    throw new Error("Service error: " + (error as Error).message);
  }
};
