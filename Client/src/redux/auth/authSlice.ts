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
import { auth } from "@/firebase/firebase";
import { RootState, AppDispatch } from "../store";

// Define the AuthState Type to type our state
interface AuthState {
  currentUser: UserInfo | null;
  userId: string | null;
  userLoggedIn: boolean;
  isEmailUser: boolean;
  isGoogleUser: boolean;
  userPhoto: string | null;
  userName: string | null;
  loading: boolean;
  signInError: string | null;
  signUpError: string | null;
}

// Initial state for the auth slice
const initialState: AuthState = {
  currentUser: null,
  userId: null,
  userLoggedIn: false,
  isEmailUser: false,
  isGoogleUser: false,
  userPhoto: null,
  userName: null,
  loading: false,
  signInError: null,
  signUpError: null,
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
      console.log("USER IS HERE: ", user);
      dispatch(
        setAuthState({
          user: user.providerData[0],
          isEmailUser,
          userId: user.uid,
          userLoggedIn: true,
          userPhoto: user.photoURL,
          userName: user.displayName,
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
      await updateProfile(user, { displayName: `${firstName} ${lastName}` });
      const isEmailUser = user.providerData.some(
        (provider) => provider.providerId === "password"
      );
      dispatch(
        setAuthState({
          user: user.providerData[0],
          isEmailUser,
          userId: user.uid,
          userLoggedIn: true,
          userPhoto: user.photoURL,
          userName: user.displayName,
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
    console.log("EMAIL USER: ", user);
    const isEmailUser = user.providerData.some(
      (provider) => provider.providerId === "password"
    );
    dispatch(
      setAuthState({
        user: user.providerData[0],
        isEmailUser,
        userId: user.uid,
        userLoggedIn: true,
        userPhoto: user.photoURL,
        userName: user.displayName,
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
    console.log("google USER: ", user);

    dispatch(
      setAuthState({
        user: user.providerData[0],
        isEmailUser: false,
        userId: user.uid,
        userLoggedIn: true,
        userPhoto: user.photoURL,
        userName: user.displayName,
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
        isEmailUser: boolean;
        userId: string;
        userLoggedIn: boolean;
        userPhoto: string | null;
        userName: string | null;
      }>
    ) {
      const { user, isEmailUser, userId, userLoggedIn, userPhoto, userName } =
        action.payload;
      state.currentUser = user;
      state.isEmailUser = isEmailUser;
      state.userId = userId;
      state.userLoggedIn = userLoggedIn;
      state.userPhoto = userPhoto;
      state.userName = userName;
      state.signUpError = null;
      state.loading = false;
    },
    clearAuthState(state) {
      state.currentUser = null;
      state.isEmailUser = false;
      state.userId = null;
      state.userLoggedIn = false;
      state.userPhoto = null;
      state.userName = null;
      state.signUpError = null;
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setSignInError(state, action: PayloadAction<string | null>) {
      state.signInError = action.payload;
    },
    setSignUpError(state, action: PayloadAction<string | null>) {
      state.signUpError = action.payload;
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
