import { Collection, UpdateResult } from "mongodb";
import { UpdateUserData, UserData, UserDocument } from "@polylink/shared/types";
import { getDb } from "../../connection";

let userCollection: Collection<UserDocument>;

// Function to initialize the collection
const initializeCollection = (): void => {
  userCollection = getDb().collection("newUsers");
};

export const createUser = async (
  userData: UserData
): Promise<{ message: string; userId: string }> => {
  if (!userCollection) initializeCollection();

  try {
    const newUser: UserData = {
      userId: userData.userId,
      name: userData.name,
      userType: userData.userType,
      email: userData.email,
      emailVerified: userData.emailVerified,
      canShareData: userData.canShareData,

      availability: userData.availability,
      bio: userData.bio,
      year: userData.year,
      demographic: {
        gender: userData.demographic.gender,
        ethnicity: userData.demographic.ethnicity,
      },
      interestAreas: userData.interestAreas,
      preferredActivities: userData.preferredActivities,
      goals: userData.goals,
      flowchartInformation: {
        flowchartId: userData.flowchartInformation.flowchartId,
        startingYear: userData.flowchartInformation.startingYear,
        catalog: userData.flowchartInformation.catalog,
        major: userData.flowchartInformation.major,
        concentration: userData.flowchartInformation.concentration,
      },
    };
    const result = await userCollection.insertOne(newUser as UserDocument);
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
    const user = await userCollection.findOne(
      { userId: firebaseUserId },
      { projection: { _id: 0 } }
    );
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

export const findUserByEmail = async (
  email: string
): Promise<UserData | null> => {
  if (!userCollection) initializeCollection();
  try {
    const user = await userCollection.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });
    return user;
  } catch (error: unknown) {
    throw new Error("Error finding user: " + (error as Error).message);
  }
};
