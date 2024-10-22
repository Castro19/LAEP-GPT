import { UserInfo } from "firebase/auth";

export type AuthState = {
  currentUser: UserInfo | null; // displayName, email, photoURL, etc. (others you won't need to use)
  userId: string | null; // Unique user Id
  userLoggedIn: boolean; // Whether or not user is logged in

  loading: boolean; // State for registering
  registerError: string | null; // Error while log in or sign up
  userType: string | null; // Type of user
  isNewUser: boolean | undefined; // Whether or not the user is new
  availability: string | null; // Availability of user
  userData: MyUserInfo | null; // Add this line
};

export type Availability = {
  [day: string]: [number, number][];
};

export interface MyUserInfo {
  availability?: Availability;
  bio?: string;
  canShareData?: boolean;
  interests?: string[];
  major?: string;
  userType?: string;
  year?: string;
}
