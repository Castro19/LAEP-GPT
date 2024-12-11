import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  signInWithPopup,
  OAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  linkWithCredential,
  AuthCredential,
} from "firebase/auth";
import { loginUser, verifyCalPolyEmail } from "./crudAuth";
import { auth } from "@/firebase";
import { AppDispatch } from "../store";
import { AuthState, UserData, FirebaseError } from "@polylink/shared/types";
import { setUserData } from "../user/userSlice";
import {
  environment,
  redirectUrl,
  serverUrl,
} from "@/helpers/getEnvironmentVars";

// Initial state for the auth slice
const initialState: AuthState = {
  userId: null,
  userLoggedIn: false,
  loading: true,
  registerError: null,
  resetPasswordError: null,
  isNewUser: null,
  userType: "student",
  emailVerified: false,
  pendingCredential: null,
};

export const checkAuthentication = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch }
>("auth/checkAuthentication", async (_, { dispatch }) => {
  dispatch(setLoading(true));
  dispatch(clearRegisterError());

  try {
    // Make a request to your server to check authentication
    const response = await fetch(`${serverUrl}/auth/check`, {
      method: "GET",
      credentials: "include", // Include cookies in the request
    });

    if (response.ok) {
      const data: UserData | null = await response.json();
      if (data) {
        dispatch(
          setAuthState({
            userId: data.userId,
            userLoggedIn: true,
            userType: data.userType,
            emailVerified: data.emailVerified,
          })
        );
        dispatch(setUserData(data));
      }
    } else {
      // Not authenticated
      dispatch(clearAuthState());
    }
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to check authentication:", error);
    }
    dispatch(clearAuthState());
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
  dispatch(clearRegisterError());

  // Send the token to server to set the HTTP-only cookie
  try {
    const provider = new OAuthProvider("microsoft.com");
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    const token = await user.getIdToken(); // Get the Firebase ID token
    // Check if the user's email ends with '@calpoly.edu'
    if (user.email && (await verifyCalPolyEmail(user.email))) {
      const userResponse = await loginUser(token);
      if (userResponse) {
        if (userResponse.isNewUser) {
          dispatch(setIsNewUser(userResponse.isNewUser));
          dispatch(setUserData(userResponse.userData));
        }
        dispatch(checkAuthentication());
      } else {
        // Invalid email domain, sign out the user
        dispatch(signOutUser());
        dispatch(
          setRegisterError("Access restricted to @calpoly.edu email addresses.")
        );
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      const errorCode = error as FirebaseError;
      if (errorCode.code === "auth/account-exists-with-different-credential") {
        try {
          const email = errorCode.customData?.email;
          if (email && (await verifyCalPolyEmail(email as string))) {
            // Get Microsoft credential from the error
            const pendingCred = OAuthProvider.credentialFromError(errorCode);
            if (pendingCred) {
              // Store pendingCred in Redux to use later after user signs in with email/password
              const credData = pendingCred.toJSON();
              dispatch(setPendingCredential(credData));
              dispatch(
                setRegisterError(
                  "Account already exists with a different credential. Please sign in with your existing account (email/password) and we will automatically link your accounts."
                )
              );
            }
          } else {
            dispatch(signOutUser());
            dispatch(
              setRegisterError(
                "Access restricted to @calpoly.edu email addresses."
              )
            );
          }
        } catch (linkError) {
          if (environment === "dev") {
            console.error("Error linking accounts:", linkError);
          }
          dispatch(
            setRegisterError(
              "Failed to link accounts. Please try signing in with your existing method."
            )
          );
        }
      } else if (errorCode.code === "auth/invalid-credential") {
        dispatch(setRegisterError("Invalid credentials."));
      } else {
        dispatch(setRegisterError(errorCode.message));
      }
    } else {
      dispatch(setRegisterError((error as Error).message));
    }
    if (environment === "dev") {
      console.error("Authentication error:", error);
    }
  } finally {
    dispatch(setLoading(false));
  }
});

// Thunk for email/password sign-in
export const signInWithEmail = createAsyncThunk<
  void,
  {
    email: string;
    password: string;
  },
  { dispatch: AppDispatch }
>("auth/signInWithEmail", async ({ email, password }, { dispatch }) => {
  dispatch(setLoading(true));
  dispatch(clearRegisterError());
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const token = await user.getIdToken(); // Get the Firebase ID token
    if (user.email && (await verifyCalPolyEmail(user.email))) {
      const userResponse = await loginUser(token);
      if (userResponse) {
        if (userResponse.isNewUser) {
          dispatch(setIsNewUser(userResponse.isNewUser));
          dispatch(setUserData(userResponse.userData));
        }
        dispatch(checkAuthentication());
      } else {
        dispatch(signOutUser());
        dispatch(
          setRegisterError(
            "Failed to sign in with Microsoft. Please try again."
          )
        );
      }
    } else {
      // Invalid email domain, sign out the user
      dispatch(signOutUser());
      dispatch(
        setRegisterError("Access restricted to @calpoly.edu email addresses.")
      );
      throw new Error("Invalid email domain");
    }
  } catch (error) {
    // FIX: Handle other errors
    const errorCode = error as Error;
    if (
      errorCode.message.includes(
        "auth/account-exists-with-different-credential"
      )
    ) {
      dispatch(
        setRegisterError("Account already exists with a different credential.")
      );
    } else if (errorCode.message.includes("auth/invalid-credential")) {
      dispatch(setRegisterError("Invalid credentials."));
    } else if (errorCode.message.includes("auth/invalid-email")) {
      dispatch(setRegisterError("Invalid email address."));
    } else {
      dispatch(setRegisterError((error as Error).message));
    }
    if (environment === "dev") {
      console.error("Authentication error:", error);
    }
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
});

// Thunk for email/password sign-up
export const signUpWithEmail = createAsyncThunk<
  void,
  {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    // eslint-disable-next-line no-unused-vars
    navigate: (path: string) => void;
  },
  { dispatch: AppDispatch }
>(
  "auth/signUpWithEmail",
  async ({ email, password, firstName, lastName, navigate }, { dispatch }) => {
    dispatch(clearRegisterError());

    if (email && (await verifyCalPolyEmail(email))) {
      dispatch(setLoading(true));
      dispatch(clearRegisterError());

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Send verification email immediately after sign-up
        await sendEmailVerification(user);
        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`,
        });
        const token = await user.getIdToken(); // Get the Firebase ID token
        // Send the token to server to set the HTTP-only cookie
        try {
          if (user.emailVerified) {
            const userResponse = await loginUser(token);
            if (userResponse) {
              if (userResponse.isNewUser) {
                dispatch(setIsNewUser(userResponse.isNewUser));
                dispatch(setUserData(userResponse.userData));
              }
              dispatch(checkAuthentication());
            } else {
              dispatch(signOutUser());
              dispatch(
                setRegisterError("Failed to sign up. Please try again.")
              );
            }
          }
          navigate("/verify-email");
        } catch (error) {
          // FIX: Handle other errors
          dispatch(setRegisterError("Failed to sign up. Please try again."));
          if (environment === "dev") {
            console.error("Authentication error:", error);
          }
        } finally {
          dispatch(setLoading(false));
        }
      } catch (error) {
        const errorCode = error as Error;

        if (errorCode.message.includes("auth/invalid-email")) {
          dispatch(setRegisterError("Invalid email address."));
        } else if (errorCode.message.includes("auth/email-already-in-use")) {
          dispatch(setRegisterError("Email already in use."));
        } else {
          dispatch(setRegisterError(errorCode.message));
        }
      } finally {
        dispatch(setLoading(false));
      }
    } else {
      // Invalid email domain, sign out the user
      dispatch(signOutUser());
      dispatch(
        setRegisterError("Access restricted to @calpoly.edu email addresses.")
      );
    }
  }
);

// Define the sign-out thunk
export const signOutUser = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch }
>("auth/signOutUser", async (_, { dispatch }) => {
  dispatch(clearRegisterError());

  try {
    // Request the server to clear the cookie
    await fetch(`${serverUrl}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    // Clear the user data in Redux
    dispatch(clearAuthState());
  } catch (error) {
    if (environment === "dev") {
      console.error("Failed to sign out:", error);
    }
  }
});

export const sendResetEmail = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: string; dispatch: AppDispatch }
>("auth/sendResetEmail", async ({ email }, { rejectWithValue, dispatch }) => {
  dispatch(clearRegisterError());

  try {
    // Set your actionCodeSettings if you want a custom redirect
    const actionCodeSettings = {
      url: redirectUrl,
      handleCodeInApp: true,
    };
    if (email && (await verifyCalPolyEmail(email))) {
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
    } else {
      dispatch(setResetPasswordError("Invalid email address."));
      return rejectWithValue("Invalid email address.");
    }
  } catch (error) {
    if (environment === "dev") {
      console.error("Error sending password reset email:", error);
    }
    dispatch(setResetPasswordError("Failed to send password reset email."));
    return rejectWithValue("Failed to send password reset email.");
  }
});

// Verify the oobCode is valid
export const verifyResetCode = createAsyncThunk<
  string, // returns the user's email associated with code
  { oobCode: string },
  { rejectValue: string; dispatch: AppDispatch }
>(
  "auth/verifyResetCode",
  async ({ oobCode }, { rejectWithValue, dispatch }) => {
    dispatch(clearRegisterError());

    try {
      const email = await verifyPasswordResetCode(auth, oobCode);
      if (!email) {
        dispatch(
          setResetPasswordError("Invalid or expired password reset link.")
        );
        return rejectWithValue("Invalid or expired password reset link.");
      }
      return email;
    } catch (error) {
      if (environment === "dev") {
        console.error("Invalid or expired password reset code:", error);
      }
      dispatch(
        setResetPasswordError("Invalid or expired password reset link.")
      );
      return rejectWithValue("Invalid or expired password reset link.");
    }
  }
);

// Once verified, confirm the password reset
export const confirmNewPassword = createAsyncThunk<
  void,
  { oobCode: string; newPassword: string },
  { rejectValue: string; dispatch: AppDispatch }
>(
  "auth/confirmNewPassword",
  async ({ oobCode, newPassword }, { rejectWithValue, dispatch }) => {
    dispatch(clearRegisterError());

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
    } catch (error: unknown) {
      if (environment === "dev") {
        console.error("Failed to confirm password reset:", error);
      }
      dispatch(setResetPasswordError((error as FirebaseError).message));
      return rejectWithValue((error as Error).message);
    }
  }
);

export const linkWithMicrosoft = createAsyncThunk<
  void,
  { pendingCred: AuthCredential },
  { rejectValue: string; dispatch: AppDispatch }
>(
  "auth/linkWithMicrosoft",
  async ({ pendingCred }, { rejectWithValue, dispatch }) => {
    dispatch(clearRegisterError());

    const user = auth.currentUser;
    if (!user) {
      return rejectWithValue("User is not logged in.");
    }

    try {
      await linkWithCredential(user, pendingCred);
      dispatch(setPendingCredential(null));
    } catch (error) {
      if (environment === "dev") {
        console.error("Failed to link Microsoft account:", error);
      }
      return rejectWithValue("Failed to link Microsoft account.");
    }
  }
);

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
        userType: "student" | "admin";
        emailVerified: boolean;
      }>
    ) {
      const { userId, userLoggedIn, userType, emailVerified } = action.payload;
      state.userId = userId;
      state.userLoggedIn = userLoggedIn;
      state.userType = userType;
      state.emailVerified = emailVerified;
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
      state.emailVerified = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setRegisterError(state, action: PayloadAction<string | null>) {
      state.registerError = action.payload;
    },
    clearRegisterError(state) {
      state.registerError = null;
    },
    setEmailVerifyError(state, action: PayloadAction<string | null>) {
      state.registerError = action.payload;
    },
    setResetPasswordError(state, action: PayloadAction<string | null>) {
      state.resetPasswordError = action.payload;
    },
    clearResetPasswordError(state) {
      state.resetPasswordError = null;
    },
    setPendingCredential(
      state,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      action: PayloadAction<Record<string, any> | null>
    ) {
      state.pendingCredential = action.payload;
    },
  },
});

export const {
  setAuthState,
  setIsNewUser,
  clearAuthState,
  setLoading,
  setRegisterError,
  setEmailVerifyError,
  clearRegisterError,
  setResetPasswordError,
  clearResetPasswordError,
  setPendingCredential,
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
