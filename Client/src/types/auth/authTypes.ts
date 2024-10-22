import { UserInfo } from "firebase/auth";

// All information can automatically be set for the user (User should not be able to change any of this except for the data inside userData)
export type AuthState = {
  currentUser: UserInfo | null; // displayName, email, photoURL, etc. (others you won't need to use)
  userId: string | null; // Unique user Id
  userLoggedIn: boolean; // Whether or not user is logged in
  loading: boolean; // State for registering
  registerError: string | null; // Error while log in or sign up
  isNewUser: boolean | undefined; // Whether or not the user is new
  userType: string;
  userData: MyUserInfo | null; // Add this line
};

export type Availability = {
  [day: string]: [number, number][];
};

// All information user inputted themselves
export interface MyUserInfo {
  availability?: Availability;
  bio?: string;
  canShareData: boolean;
  interests?: string[];
  major?: string;
  year?: string;
}
