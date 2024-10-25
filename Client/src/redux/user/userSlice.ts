// userSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store"; // Adjust the import path as needed
import { putUserProfile } from "./crudUser"; // Adjust the import path as needed
import { auth } from "@/firebase";
import { MyUserInfo } from "@/types";

// Define the initial state for the user
interface UserState {
  userData: MyUserInfo;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userData: {
    userId: "",
    bio: "",
    year: "",
    interests: [],
    availability: {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    },
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
        availability: updatedInfo.availability,
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
    // FIX Tech Debt: Potentially set this data in the backend for new users
    setUserData(state, action) {
      state.userData = {
        userId: action.payload.userId ?? initialState.userData.userId,
        bio: action.payload.bio ?? initialState.userData.bio,
        year: action.payload.year ?? initialState.userData.year,
        interests: action.payload.interests ?? initialState.userData.interests,
        availability: {
          Monday:
            action.payload.availability?.Monday ??
            initialState.userData.availability.Monday,
          Tuesday:
            action.payload.availability?.Tuesday ??
            initialState.userData.availability.Tuesday,
          Wednesday:
            action.payload.availability?.Wednesday ??
            initialState.userData.availability.Wednesday,
          Thursday:
            action.payload.availability?.Thursday ??
            initialState.userData.availability.Thursday,
          Friday:
            action.payload.availability?.Friday ??
            initialState.userData.availability.Friday,
          Saturday:
            action.payload.availability?.Saturday ??
            initialState.userData.availability.Saturday,
          Sunday:
            action.payload.availability?.Sunday ??
            initialState.userData.availability.Sunday,
        },
        canShareData:
          action.payload.canShareData ?? initialState.userData.canShareData,
        name: action.payload.name ?? initialState.userData.name,
        email: action.payload.email ?? initialState.userData.email,
        major: action.payload.major ?? initialState.userData.major,
      };
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
