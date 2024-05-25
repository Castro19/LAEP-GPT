import { User } from "firebase/auth";

export type AuthState = {
  currentUser: User | null;
  userId: string | null;
  userLoggedIn: boolean;
  isEmailUser: boolean;
  isGoogleUser: boolean;
  loading: boolean;
};
