import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUserType = createAsyncThunk<
  string | undefined,
  string,
  { rejectValue: string }
>("auth/fetchUserType", async (firebaseUserId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`http://localhost:4000/users/${firebaseUserId}`);
    console.log("Fetched userType: ", response.data.userType);
    return response.data.userType;
  } catch (error) {
    return rejectWithValue("Failed to fetch userType");
  }
});

export const fetchAbout = createAsyncThunk<
  string | undefined,
  string,
  { rejectValue: string }
>("auth/fetchAbout", async (firebaseUserId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`http://localhost:4000/users/${firebaseUserId}`);
    console.log("Fetched about: ", response.data.about);
    return response.data.about;
  } catch (error) {
    return rejectWithValue("Failed to fetch about");
  }
});
