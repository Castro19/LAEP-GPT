// userSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store"; // Adjust the import path as needed
import { putUserProfile } from "./crudUser"; // Adjust the import path as needed
import { auth } from "@/firebase";
import { MyUserInfo } from "@/types";
import { Availability } from "@/types/auth/authTypes";

// Define the initial state for the user
interface UserState {
  userData: MyUserInfo | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userData: {
    userId: "",
    bio: "",
    year: "",
    interests: null,
    availability: null,
    canShareData: false,
    name: "",
    email: "",
    major: "",
  },
  loading: false,
  error: null,
};

// Thunk for updating user userData
export const updateUserProfile = createAsyncThunk<
  void,
  MyUserInfo,
  { dispatch: AppDispatch }
>("user/updateUserProfile", async (updatedInfo, { dispatch }) => {
  dispatch(setUserLoading(true));
  try {
    const user = auth.currentUser;
    if (user) {
      // Convert UserProfile to MyUserInfo
      const myUserInfo: MyUserInfo = {
        ...updatedInfo,
        availability: updatedInfo.availability as Availability,
      };
      await putUserProfile(myUserInfo);
      dispatch(setUserData(myUserInfo));
    } else {
      throw new Error("No user is currently logged in.");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Failed to update user userData:", error);
    dispatch(setUserError(error.message));
  } finally {
    dispatch(setUserLoading(false));
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData(state, action) {
      state.userData = action.payload;
    },
    setUserLoading(state, action) {
      state.loading = action.payload;
    },
    setUserError(state, action) {
      state.error = action.payload;
    },
    updateUserData(state, action: PayloadAction<Partial<MyUserInfo>>) {
      if (state.userData) {
        state.userData = { ...state.userData, ...action.payload };
      }
    },
    // ... other reducers
  },
});

export const { setUserData, setUserLoading, setUserError, updateUserData } =
  userSlice.actions;

export const userReducer = userSlice.reducer;
