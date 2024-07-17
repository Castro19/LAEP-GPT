import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  UserInfo,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import sendUserToDB from "./crudAuth";
import { auth } from "@/firebase";
import { RootState, AppDispatch } from "../store";
import { AuthState } from "@/types";

// Initial state for the auth slice
const initialState: AuthState = {
  currentUser: null,
  userId: null,
  userLoggedIn: false,
  isEmailUser: false,
  loading: false,
  registerError: null,
  userType: null,
};

// Register the listener to track auth state changes
let authListenerUnsubscribe: () => void;

// Thunk to listen to authentication state changes
export const listenToAuthChanges = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; state: RootState }
>("auth/listenToAuthChanges", async (_, { dispatch, getState }) => {
  dispatch(setLoading(true));
  if (authListenerUnsubscribe) {
    authListenerUnsubscribe();
  }
  authListenerUnsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      const isEmailUser = user.providerData.some(
        (provider) => provider.providerId === "password"
      );

      let userType = getState().auth.userType;
      if (!userType) {
        userType = null; //no usertype for some reason fix
      }

      // Ensure user displayName is updated in the state
      const updatedUser = {
        ...user.providerData[0],
        displayName: user.displayName || '',
      };

      dispatch(
        setAuthState({
          user: updatedUser,
          userId: user.uid,
          userLoggedIn: true,
          isEmailUser,
          userType,
        })
      );
    } else {
      dispatch(clearAuthState());
    }
  });
  dispatch(setLoading(false));
});

// Thunk for updating user profile
export const updateUserProfile = createAsyncThunk<
  void,
  Partial<UserInfo> & { userType?: string }, 
  { dispatch: AppDispatch }
>(
  "auth/updateUserProfile",
  async (updatedInfo, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user is currently logged in.");

      // Prepare updated profile data
      const profileUpdates: { displayName?: string; photoURL?: string; userType?: string } = {};
      if (updatedInfo.displayName) {
        profileUpdates.displayName = updatedInfo.displayName;
      }
      if (updatedInfo.userType) {
        profileUpdates.userType = updatedInfo.userType; // Pass userType to profileUpdates
      }

      // Update profile in Firebase Auth
      await updateProfile(user, profileUpdates);

      // Update Redux state with the new user info
      const updatedUser = {
        ...user,
        displayName: updatedInfo.displayName || user.displayName,
        // Add more fields as needed
      };

      dispatch(
        setAuthState({
          user: updatedUser as UserInfo,
          userId: user.uid,
          userLoggedIn: true,
          isEmailUser: user.providerData.some(provider => provider.providerId === "password"),
          userType: updatedInfo.userType || null, // Update userType in the auth state
        })
      );
    } catch (error) {
      console.error("Failed to update user profile:", error);
    } finally {
      dispatch(setLoading(false));
    }
  }
);




// Thunk for email/password sign-up
export const signUpWithEmail = createAsyncThunk<void, { email: string; password: string; firstName: string; lastName: string; userType: string }, { dispatch: AppDispatch }>(
  "auth/signUpWithEmail",
  async ({ email, password, firstName, lastName, userType }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password, userType);
      const user = userCredential.user;

      // Update profile with first name and last name
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
        userType: userType, 
      });

      console.log("User type during sign-up:", userType); 

      // Send user information to database
      await sendUserToDB(user.uid, firstName, lastName, userType);

      // Determine if user is email-based
      const isEmailUser = user.providerData.some(provider => provider.providerId === "password");

      // Create a new user object with the updated displayName to avoid direct mutation
      const updatedUser = {
        ...user.providerData[0],
        displayName: `${firstName} ${lastName}`,
      };

      dispatch(
        setAuthState({
          user: updatedUser,
          userId: user.uid,
          userLoggedIn: true,
          isEmailUser,
          userType,
        })
      );
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setSignUpError(error.message));
      }
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Thunk for email/password sign-in
export const signInWithEmail = createAsyncThunk<
  void,
  { email: string; password: string },
  { dispatch: AppDispatch; state: RootState }
>("auth/signInWithEmail", async ({ email, password }, { dispatch }) => {
  dispatch(setLoading(true));
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const isEmailUser = user.providerData.some(
      (provider) => provider.providerId === "password"
    );
    dispatch(
      setAuthState({
      user: user.providerData[0],
      userId: user.uid,
      userLoggedIn: true,
      isEmailUser,
      userType: null,
      })
    );
  } catch (error) {
    dispatch(
      setSignInError(
        "Failed to sign in. Please check your credentials and try again."
      )
    );
  } finally {
    dispatch(setLoading(false));
  }
});

// Thunk for Google sign-in
export const signInWithGoogle = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch }
>("auth/signInWithGoogle", async (_, { dispatch }) => {
  dispatch(setLoading(true));
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    // Check if its a new user (not in db): If it is then run this line
    // sendUserToDB(user.uid, "", "");

    dispatch(
      setAuthState({
        user: user.providerData[0],
        userId: user.uid,
        userLoggedIn: true,
        isEmailUser: false,
        userType: null,
      })
    );
  } catch (error) {
    dispatch(
      setSignInError("Failed to sign in with Google. Please try again.")
    );
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
        isEmailUser: boolean;
        userType: string | null;
      }>
    ) {
      const { user, userId, userLoggedIn, isEmailUser, userType } = action.payload;
      state.currentUser = user;
      state.userId = userId;
      state.userLoggedIn = userLoggedIn;
      state.isEmailUser = isEmailUser;
      state.userType = userType;
    },
    clearAuthState(state) {
      state.currentUser = null;
      state.userLoggedIn = false;
      state.isEmailUser = false;
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setSignInError(state, action: PayloadAction<string | null>) {
      state.registerError = action.payload;
    },
    setSignUpError(state, action: PayloadAction<string | null>) {
      state.registerError = action.payload;
    },
  },
});

export const {
  setAuthState,
  clearAuthState,
  setLoading,
  setSignInError,
  setSignUpError,
} = authSlice.actions;

export const authReducer = authSlice.reducer;