import { Collection, UpdateResult } from "mongodb";
import { UpdateUserData, UserData } from "@polylink/shared/types";
import { getDb } from "../../connection";

let userCollection: Collection<UserData>;

// Function to initialize the collection
const initializeCollection = (): void => {
  userCollection = getDb().collection("users");
};

export const createUser = async (
  userData: UserData
): Promise<{ message: string; userId: string }> => {
  if (!userCollection) initializeCollection();
  console.log("Creating user in database", userData);
  try {
    const newUser: UserData = {
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
      emailVerified: userData.emailVerified,
    };
    const result = await userCollection.insertOne(newUser);
    return {
      message: "User created successfully",
      userId: result.insertedId.toString(),
    };
  } catch (error: unknown) {
    throw new Error("Error creating a new user: " + (error as Error).message);
  }
};

export const findUserByFirebaseId = async (
  firebaseUserId: string
): Promise<UserData | null> => {
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
  updateData: UpdateUserData
): Promise<UpdateResult | null> => {
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
export const findAllUsers = async (): Promise<UserData[]> => {
  if (!userCollection) initializeCollection();
  try {
    const users = await userCollection.find({}).toArray();
    return users;
  } catch (error: unknown) {
    throw new Error("Error retrieving all users: " + (error as Error).message);
  }
};
