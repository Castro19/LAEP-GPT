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
};

// Register the listener to track auth state changes
let authListenerUnsubscribe: () => void;

// Thunk to listen to authentication state changes
export const listenToAuthChanges = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; state: RootState }
>("auth/listenToAuthChanges", async (_, { dispatch }) => {
  dispatch(setLoading(true));
  if (authListenerUnsubscribe) {
    authListenerUnsubscribe();
  }
  authListenerUnsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      const isEmailUser = user.providerData.some(
        (provider) => provider.providerId === "password"
      );
      dispatch(
        setAuthState({
          user: user.providerData[0],
          userId: user.uid,
          userLoggedIn: true,
          isEmailUser,
        })
      );
    } else {
      dispatch(clearAuthState());
    }
  });
  dispatch(setLoading(false));
});

// Thunk for email/password sign-up
export const signUpWithEmail = createAsyncThunk<
  void,
  { email: string; password: string; firstName: string; lastName: string },
  { dispatch: AppDispatch }
>(
  "auth/signUpWithEmail",
  async ({ email, password, firstName, lastName }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      sendUserToDB(user.uid, firstName, lastName);

      await updateProfile(user, { displayName: `${firstName} ${lastName}` });
      const isEmailUser = user.providerData.some(
        (provider) => provider.providerId === "password"
      );
      dispatch(
        setAuthState({
          user: user.providerData[0],
          userId: user.uid,
          isEmailUser,
          userLoggedIn: true,
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
      }>
    ) {
      const { user, userId, userLoggedIn, isEmailUser } = action.payload;
      state.currentUser = user;
      state.userId = userId;
      state.userLoggedIn = userLoggedIn;
      state.isEmailUser = isEmailUser;
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
