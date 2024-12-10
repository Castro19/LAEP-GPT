import { AuthCredential } from "firebase/auth";

// All information can automatically be set for the user (User should not be able to change any of this except for the data inside userData)
export type AuthState = {
  userId: string | null; // Unique user Id
  userLoggedIn: boolean; // Whether or not user is logged in
  loading: boolean; // State for registering
  registerError: string | null; // Error while log in or sign up
  resetPasswordError: string | null; // Error while resetting password
  isNewUser: boolean | null; // Whether or not the user is new
  userType: string;
  emailVerified: boolean;
  pendingCredential: Record<string, any> | null;
};
