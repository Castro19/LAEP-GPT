import { UserInfo } from "firebase/auth";

export type AuthState = {
  currentUser: UserInfo | null; // displayName, email, photoURL, etc. (others you won't need to use)
  userId: string | null; // Unique user Id
  userLoggedIn: boolean; // Whether or not user is logged in
  isEmailUser: boolean; // Whether or not they are an E-mail user or google Use r
  loading: boolean; // State for registering
  registerError: string | null; // Error while log in or sign up
  userType: string | null; // Type of user
};
