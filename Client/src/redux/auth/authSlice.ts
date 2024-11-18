import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { signInWithPopup, OAuthProvider } from "firebase/auth";
import { loginUser } from "./crudAuth";
import { auth } from "@/firebase";
import { AppDispatch } from "../store";
import { AuthState } from "@/types";
import { setUserData } from "../user/userSlice";

// Initial state for the auth slice
const initialState: AuthState = {
  userId: null,
  userLoggedIn: false,
  loading: true,
  registerError: null,
  isNewUser: null,
  userType: "student",
};

export const checkAuthentication = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch }
>("auth/checkAuthentication", async (_, { dispatch }) => {
  dispatch(setLoading(true));

  try {
    // Make a request to your server to check authentication
    const response = await fetch("http://localhost:4000/auth/check", {
      method: "GET",
      credentials: "include", // Include cookies in the request
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(
        setAuthState({
          userId: data.userId,
          userLoggedIn: true,
          userType: data.userType,
        })
      );
      dispatch(setUserData(data));
    } else {
      // Not authenticated
      dispatch(clearAuthState());
    }
  } catch (error) {
    console.error("Failed to check authentication:", error);
    dispatch(clearAuthState());
  } finally {
    dispatch(setLoading(false));
  }
});

export const signInWithMicrosoft = createAsyncThunk<
  void,
  // eslint-disable-next-line no-unused-vars
  { navigate: (path: string) => void },
  { dispatch: AppDispatch }
>("auth/signInWithMicrosoft", async ({ navigate }, { dispatch }) => {
  dispatch(setLoading(true));
  const provider = new OAuthProvider("microsoft.com");
  const userCredential = await signInWithPopup(auth, provider);
  const user = userCredential.user;
  const token = await user.getIdToken(); // Get the Firebase ID token
  // Send the token to server to set the HTTP-only cookie
  try {
    // Check if the user's email ends with '@calpoly.edu'
    if (user.email && user.email.endsWith("@calpoly.edu")) {
      const userResponse = await loginUser(token);
      if (userResponse.isNewUser) {
        dispatch(setIsNewUser(userResponse.isNewUser));
        dispatch(setUserData(userResponse.userData));
      }
      dispatch(checkAuthentication());
    } else {
      // Invalid email domain, sign out the user
      dispatch(signOutUser({ navigate }));
      dispatch(
        setSignInError("Access restricted to @calpoly.edu email addresses.")
      );
    }
  } catch (error) {
    // FIX: Handle other errors
    dispatch(
      setSignInError("Failed to sign in with Microsoft. Please try again.")
    );
    console.error("Authentication error:", error);
  } finally {
    dispatch(setLoading(false));
  }
});

// Define the sign-out thunk
export const signOutUser = createAsyncThunk<
  void,
  // eslint-disable-next-line no-unused-vars
  { navigate: (path: string) => void },
  { dispatch: AppDispatch }
>("auth/signOutUser", async ({ navigate }, { dispatch }) => {
  try {
    // Request the server to clear the cookie
    await fetch("http://localhost:4000/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    // Clear the user data in Redux
    dispatch(clearAuthState());
    navigate("/");
  } catch (error) {
    console.error("Failed to sign out:", error);
  }
});

// Creating the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState(
      state,
      action: PayloadAction<{
        userId: string | null;
        userLoggedIn: boolean;
        userType: string;
      }>
    ) {
      const { userId, userLoggedIn, userType } = action.payload;
      state.userId = userId;
      state.userLoggedIn = userLoggedIn;
      state.userType = userType;
    },

    setIsNewUser(state, action: PayloadAction<boolean | null>) {
      state.isNewUser = action.payload;
    },
    clearAuthState(state) {
      state.userId = null;
      state.userLoggedIn = false;
      state.loading = false;
      state.isNewUser = null;
      state.userType = "student";
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setSignInError(state, action: PayloadAction<string | null>) {
      state.registerError = action.payload;
    },
  },
});

export const {
  setAuthState,
  setIsNewUser,
  clearAuthState,
  setLoading,
  setSignInError,
} = authSlice.actions;

export const authReducer = authSlice.reducer;

/* 
Concerns:

1. Token Expiration: Check token refresh or token validity before using it
2. Security: Move to HTTP-only cookies for storing token (Completed)
3. Error Handling: Invalid or expired tokens, will prompt user to sign in again
4. Middleware: Add middleware to intercept actions and check for token validity before proceeding
5. API Requests: For any API requests that require authentication, include the token from local storage in the request headers

*/
