import { UpdateUserData, UserData } from "@polylink/shared/types";
import * as UserModel from "./userCollection.js";

export const addUser = async (
  userData: UserData
): Promise<{ message: string; userId: string }> => {
  try {
    // Find whether the role of the user
    const result = await UserModel.createUser(userData);
    return {
      message: result.message,
      userId: result.userId,
    };
  } catch (error: unknown) {
    throw new Error("Service error: " + (error as Error).message);
  }
};

export const getUserByFirebaseId = async (
  firebaseUserId: string
): Promise<UserData | null> => {
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
): Promise<void> => {
  try {
    await UserModel.updateUserByFirebaseId(firebaseUserId, updateData);
  } catch (error: unknown) {
    throw new Error("Service error: " + (error as Error).message);
  }
};

// Add the function to get all users
export const getAllUsers = async (): Promise<UserData[]> => {
  try {
    const users = await UserModel.findAllUsers();
    return users;
  } catch (error: unknown) {
    throw new Error("Service error: " + (error as Error).message);
  }
};
