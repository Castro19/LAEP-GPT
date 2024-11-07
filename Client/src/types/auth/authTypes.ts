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

// All information stored in the database
export interface MyUserInfo {
  userId: string;
  name: string;
  email: string;
  availability: Availability;
  bio: string;
  canShareData: boolean;
  interests: string[];
  major: string;
  year: string;
  courses: string[];
}
