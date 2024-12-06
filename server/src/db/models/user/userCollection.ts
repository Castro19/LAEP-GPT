import { Collection } from "mongodb";
import { UserData } from "../../../types";
import { getDb } from "../../connection";

let userCollection: Collection;

// Function to initialize the collection
const initializeCollection = () => {
  userCollection = getDb().collection("users");
};

export const createUser = async (userData: UserData) => {
  if (!userCollection) initializeCollection();
  console.log("Creating user in database", userData);
  try {
    const newUser = {
      userId: userData.userId,
      name: userData.name,
      userType: userData.userType,
      email: userData.email,
      bio: userData.bio,
      year: userData.year,
      interests: userData.interests,
      courses: userData.courses,
      availability: userData.availability,
      canShareData: userData.canShareData,
      startingYear: userData.startingYear,
      catalog: userData.catalog,
      major: userData.major,
      concentration: userData.concentration,
      flowchartId: userData.flowchartId,
    };
    const result = await userCollection.insertOne(newUser);
    return result;
  } catch (error: unknown) {
    throw new Error("Error creating a new user: " + (error as Error).message);
  }
};

export const findUserByFirebaseId = async (firebaseUserId: string) => {
  if (!userCollection) initializeCollection();
  try {
    const user = await userCollection.findOne({ userId: firebaseUserId });
    return user;
  } catch (error: unknown) {
    throw new Error("Error finding user: " + (error as Error).message);
  }
};

export const updateUserByFirebaseId = async (
  firebaseUserId: string,
  updateData: UserData
) => {
  if (!userCollection) initializeCollection();
  try {
    const result = await userCollection.updateOne(
      { userId: firebaseUserId },
      { $set: updateData }
    );
    return result;
  } catch (error: unknown) {
    throw new Error("Error updating user: " + (error as Error).message);
  }
};

// Add the function to find all users
export const findAllUsers = async () => {
  if (!userCollection) initializeCollection();
  try {
    const users = await userCollection.find({}).toArray();
    return users;
  } catch (error: unknown) {
    throw new Error("Error retrieving all users: " + (error as Error).message);
  }
};
