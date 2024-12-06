// All information can automatically be set for the user (User should not be able to change any of this except for the data inside userData)
export type AuthState = {
  userId: string | null; // Unique user Id
  userLoggedIn: boolean; // Whether or not user is logged in
  loading: boolean; // State for registering
  registerError: string | null; // Error while log in or sign up
  isNewUser: boolean | null; // Whether or not the user is new
  userType: string;
};

export type Availability = {
  [day: string]: [number, number][];
};

export type UserType = "student" | "admin";
// All information stored in the database
// changed from MyUserInfo to UserData
export type UserData = {
  userId: string;
  name: string;
  userType: "student" | "admin";
  email: string;
  availability: Availability;
  bio: string;
  canShareData: boolean;
  interests: string[];
  startingYear: string;
  catalog: string;
  major: string;
  concentration: string;
  year: string;
  courses: string[];
  flowchartId: string;
};

export type UpdateUserData = Partial<UserData>;
