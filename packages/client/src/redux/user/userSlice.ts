// userSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store"; // Adjust the import path as needed
import { putUserProfile } from "./crudUser"; // Adjust the import path as needed
import { auth } from "@/firebase";
import { UpdateUserData, UserData } from "@polylink/shared/types";
import { environment } from "@/helpers/getEnvironmentVars";

// Define the initial state for the user
export interface UserState {
  userData: UserData;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userData: {
    userId: "",
    name: "",
    userType: "student",
    email: "",
    emailVerified: false,
    canShareData: false,

    availability: {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    },
    bio: "",
    year: "freshman",
    demographic: {
      gender: "",
      ethnicity: "",
    },
    interestAreas: [],
    preferredActivities: [],
    goals: [],
    flowchartInformation: {
      flowchartId: "",
      startingYear: "",
      catalog: "",
      major: "",
      concentration: "",
    },
  },
  loading: false,
  error: null,
};

// Thunk for updating user userData
export const updateUserProfile = createAsyncThunk<
  void,
  void,
  { state: RootState }
>("user/updateUserProfile", async (_, { dispatch, getState }) => {
  dispatch(setUserLoading(true));
  try {
    const user = auth.currentUser;

    if (user) {
      const state = getState() as RootState;
      const updatedInfo = state.user.userData;

      await putUserProfile(updatedInfo);
      dispatch(setUserData(updatedInfo));
    } else {
      throw new Error("No user is currently logged in.");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An unknown error occurred.";
    if (environment === "dev") {
      console.error("Failed to update user data:", errorMessage);
    }
    dispatch(setUserError(errorMessage));
  } finally {
    dispatch(setUserLoading(false));
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<UserData>) {
      state.userData = action.payload;
    },
    setUserLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setUserError(state, action) {
      state.error = action.payload;
    },
    updateUserData(state, action: PayloadAction<UpdateUserData>) {
      Object.assign(state.userData, action.payload);
    },
    // ... other reducers
  },
});

export const { setUserData, setUserLoading, setUserError, updateUserData } =
  userSlice.actions;

export const userReducer = userSlice.reducer;
