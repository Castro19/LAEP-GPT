import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  UserInfo,
  signInWithPopup,
  onAuthStateChanged,
  OAuthProvider,
} from "firebase/auth";
import { registerUserToDB } from "./crudAuth";
import { auth } from "@/firebase";
import { RootState, AppDispatch } from "../store";
import { AuthState, Availability, MyUserInfo } from "@/types";
import axios from "axios";

// Initial state for the auth slice
const initialState: AuthState = {
  currentUser: null,
  userId: null,
  userLoggedIn: false,
  loading: true,
  registerError: null,
  isNewUser: undefined,
  userType: "student",
  userData: null,
};

// Register the listener to track auth state changes
let authListenerUnsubscribe: () => void;

// Thunk for triggering file upload
export const uploadFileToAssistant = createAsyncThunk<
  void,
  { assistantId: string },
  { dispatch: AppDispatch }
>("auth/uploadFileToAssistant", async ({ assistantId }) => {
  try {
    // Trigger file upload to the server with the assistant ID
    await axios.post(
      `http://localhost:4000/fileOperations/upload/${assistantId}`
    );
    console.log("File uploaded successfully.");
  } catch (error) {
    console.error("Failed to upload file:", error);
  }
});

// Thunk to listen to authentication state changes
export const listenToAuthChanges = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; state: RootState }
>("auth/listenToAuthChanges", async (_, { dispatch }) => {
  dispatch(setLoading(true));
  console.log("LISTENING TO AUTH CHANGES");
  if (authListenerUnsubscribe) {
    authListenerUnsubscribe();
  }
  authListenerUnsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      let userType = "student";
      const userId = user.uid; // Use user.uid instead of getState().auth
      let userData: MyUserInfo | null = null;
      updateUserProfile;
      // fetch user data from MongoDB database
      try {
        const response = await fetch(`http://localhost:4000/users/${userId}`);
        const data = await response.json();
        userType = data.userType;
        userData = data;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

      const updatedUser = {
        ...user.providerData[0],
        displayName: user.displayName || "",
      };

      dispatch(
        setAuthState({
          user: updatedUser,
          userId: userId,
          userLoggedIn: true,
          userType,
        })
      );
      dispatch(setUserData(userData));
    } else {
      dispatch(clearAuthState());
    }
    dispatch(setLoading(false));
  });
});

// Thunk for updating user profile
export const updateUserProfile = createAsyncThunk<
  void,
  {
    availability?: Availability;
    bio?: string;
    canShareData: boolean;
    interests?: string[];
    major?: string;
    year?: string;
  }, // Add availability and about here
  { dispatch: AppDispatch }
>("auth/updateUserProfile", async (updatedInfo, { dispatch }) => {
  dispatch(setLoading(true));
  const userId = auth.currentUser?.uid;
  console.log("UPDATING USER PROFILE WITH: ", updatedInfo);
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No user is currently logged in.");

    await fetch(`http://localhost:4000/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedInfo),
    });
    // Optionally update the userData in the store
    dispatch(setUserData(updatedInfo));
  } catch (error) {
    console.error("Failed to update user profile:", error);
  } finally {
    dispatch(setLoading(false));
  }
});
export const signInWithMicrosoft = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch }
>("auth/signInWithMicrosoft", async (_, { dispatch }) => {
  dispatch(setLoading(true));
  try {
    const provider = new OAuthProvider("microsoft.com");
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    console.log("USER CREDENTIAL: ", userCredential);
    // Check if the user's email ends with '@calpoly.edu'
    if (user.email && user.email.endsWith("@calpoly.edu")) {
      const userData = {
        userId: user.uid,
        name: user.displayName,
        email: user.email,
      };

      // Send user information to database
      const userResponse = await registerUserToDB(userData);
      console.log("USER RESPONSE: ", userResponse);

      dispatch(
        setAuthState({
          user: user.providerData[0],
          userId: user.uid,
          userLoggedIn: true,
          userType: userResponse.userType || "student", // FIX: [userType] Return role type from database
        })
      );
      if (userResponse.isNewUser) {
        dispatch(setIsNewUser(userResponse.isNewUser));
      }
    } else {
      // Invalid email domain, sign out the user
      await auth.signOut();
      dispatch(
        setSignInError("Access restricted to @calpoly.edu email addresses.")
      );
    }
  } catch (error) {
    // Handle other errors
    dispatch(
      setSignInError("Failed to sign in with Microsoft. Please try again.")
    );
    console.error("Authentication error:", error);
  } finally {
    dispatch(setLoading(false));
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
        user: UserInfo;
        userId: string | null;
        userLoggedIn: boolean;
        userType: string;
      }>
    ) {
      const { user, userId, userLoggedIn, userType } = action.payload;
      state.currentUser = user;
      state.userId = userId;
      state.userLoggedIn = userLoggedIn;
      state.userType = userType;
    },
    setUserData(state, action: PayloadAction<MyUserInfo | null>) {
      state.userData = action.payload;
    },
    updateUserData(state, action: PayloadAction<Partial<MyUserInfo>>) {
      if (state.userData) {
        state.userData = { ...state.userData, ...action.payload };
      }
    },
    setIsNewUser(state, action: PayloadAction<boolean | undefined>) {
      state.isNewUser = action.payload;
    },
    clearAuthState(state) {
      state.currentUser = null;
      state.userLoggedIn = false;
      state.loading = false;
      state.isNewUser = undefined;
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
  setUserData,
  updateUserData,
  setIsNewUser,
  clearAuthState,
  setLoading,
  setSignInError,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
