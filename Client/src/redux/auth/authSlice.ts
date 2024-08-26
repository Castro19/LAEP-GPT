import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  UserInfo,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  // signInWithPopup, legacy google import
  // GoogleAuthProvider, legacy google import
  onAuthStateChanged,
  sendEmailVerification
} from "firebase/auth";
import sendUserToDB from "./crudAuth";
import { auth } from "@/firebase";
import { RootState, AppDispatch } from "../store";
import { AuthState } from "@/types";
import { createAssistantOnServer } from '../../apiHelpers';






// Initial state for the auth slice
const initialState: AuthState = {
  currentUser: null,
  userId: null,
  userLoggedIn: false,
  isEmailUser: false,
  loading: false,
  registerError: null,
  userType: null,
  availability: null,
  emailVerified: false
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

      const userType = getState().auth.userType;

      console.log("ranAuthChange");
      console.log("User type after auth change:", userType);
      console.log("UserID after auth change:", user.uid);
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
          emailVerified: user.emailVerified,
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
  Partial<UserInfo> & { userType?: string; about?: string; availability?: string }, // Add availability and about here
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
        profileUpdates.userType = updatedInfo.userType; 
      }

      // Update profile in Firebase Auth
      await updateProfile(user, profileUpdates);

      // Update Redux state with the new user info
      const updatedUser = {
        ...user,
        displayName: updatedInfo.displayName || user.displayName,
        userType: updatedInfo.userType || user.providerData[5]?.userType,
        // Add more fields as needed
      };

      dispatch(
        setAuthState({
          user: updatedUser as UserInfo,
          userId: user.uid,
          userLoggedIn: true,
          isEmailUser: user.providerData.some(provider => provider.providerId === "password"),
          userType: updatedInfo.userType || null, // Update userType in the auth state
          emailVerified: user.emailVerified
        })
      );

      // Update about and availability in the database
      const userData = {
        firebaseUserId: user.uid,
        ...updatedInfo,
      };
      await fetch(`http://localhost:4000/users/${user.uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

    } catch (error) {
      console.error("Failed to update user profile:", error);
    } finally {
      dispatch(setLoading(false));
    }
  }
);





// Thunk for email/password sign-up
export const signUpWithEmail = createAsyncThunk<void, { email: string; password: string; firstName: string; lastName: string; userType: string; about?: string; availability: string }, { dispatch: AppDispatch }>(
  "auth/signUpWithEmail",
  async ({ email, password, firstName, lastName, userType, about, availability }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with first name and last name
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
        userType: userType, 
      });

      // Send verification email immediately after sign-up
      await sendEmailVerification(user);
      
      const userData = {
        firebaseUserId: user.uid,
        firstName,
        lastName,
        userType,
        availability, // Include availability
      };

      // Include 'about' field if the user is a teacher
      if (userType === "teacher" && about) {
        userData.about = about;
      }

      // Send user information to database
      await sendUserToDB(userData);

      // Determine if user is email-based
      const isEmailUser = user.providerData.some(provider => provider.providerId === "password");
      
      // Create a new user object with the updated displayName to avoid direct mutation
      const updatedUser = {
        ...user.providerData[0],
        displayName: `${firstName} ${lastName}`,
        userType: userType,
      };

      // Create GPT assistant if user is a teacher
      if (userType === "teacher" && about) {
        const assistantPrompt = `You are ${firstName} ${lastName} and you are available ${availability}. Here is some information about you: ${about}. Your job is to see student prompts and decide if you would be a good advisor for their project, and prompt them to send it to the other assistants to refine their prompt based on social justice and ethical guidelines.`;
        await createAssistantOnServer(`${firstName} ${lastName}`, "Teacher Assistant", assistantPrompt);
      }
      
      dispatch(
        setAuthState({
          user: updatedUser,
          userId: user.uid,
          userLoggedIn: true,
          isEmailUser,
          userType: userType,
          emailVerified: user.emailVerified,
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
    const userType = user.userType;
    console.log("User type during sign-in:", userType);
    dispatch(
      setAuthState({
      user: user.providerData[0],
      userId: user.uid,
      userLoggedIn: true,
      isEmailUser,
      userType: user.providerData[5]?.userType,
      emailVerified: user.emailVerified
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

// Thunk for Google sign-in (LEGACY)
{/* export const signInWithGoogle = createAsyncThunk<
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
*/}

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
        emailVerified: boolean;
      }>
    ) {
      const { user, userId, userLoggedIn, isEmailUser, userType, emailVerified } = action.payload;
      state.currentUser = user;
      state.userId = userId;
      state.userLoggedIn = userLoggedIn;
      state.isEmailUser = isEmailUser;
      state.userType = userType;
      state.emailVerified = emailVerified;
    },
    clearAuthState(state) {
      state.currentUser = null;
      state.userLoggedIn = false;
      state.isEmailUser = false;
      state.loading = false;
      state.emailVerified = false;
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
    setEmailVerifyError(state, action: PayloadAction<string | null>) {
      state.registerError = action.payload;
    }
  },
});

export const {
  setAuthState,
  clearAuthState,
  setLoading,
  setSignInError,
  setSignUpError,
  setEmailVerifyError
} = authSlice.actions;

export const authReducer = authSlice.reducer;
