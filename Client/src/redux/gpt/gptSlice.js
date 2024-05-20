import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createGPT, deleteGPT } from "./crudGPT";

/*
front-end:
gpts = [
    {id, title, desc, url_photo}
]

back-end: 
gpts = [
    {_id, userId, title, desc, instructions, url_photo}
    // other info: gpt Model, assistant_id, 
]
*/
// Create
export const addGpt = createAsyncThunk(
  "gpt/addGpt",
  async (
    { userId, title, urlPhoto, desc, instructions },
    { rejectWithValue }
  ) => {
    try {
      const addGpt = await createGPT({
        userId,
        title,
        urlPhoto,
        desc,
        instructions,
      });

      if (addGpt) {
        return {
          id: addGpt.id,
          title: title,
          desc: desc,
        };
      }
    } catch (error) {
      console.error("Failed to create GPT: ", error);
      return rejectWithValue(error.toString());
    }
  }
);

// Read
export const viewGpts = createAsyncThunk(
  "gpt/viewGpts",
  async ({ gptList }, { rejectWithValue }) => {
    try {
      return { gptList };
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const deleteGpt = createAsyncThunk(
  "gpt/deleteGpt",
  async ({ id }, { rejectWithValue }) => {
    try {
      await deleteGPT(id);
      return { id };
    } catch (error) {
      console.error("Failed to Delete GPT: ", error);
      return rejectWithValue(error.toString());
    }
  }
);
const initialState = {
  gptList: [],
};

const gptSlice = createSlice({
  name: "gpt",
  initialState,
  reducers: {
    // Init the Log List:
    initGptList: (state, action) => {
      const gptList = action.payload;
      state.gptList = gptList;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addGpt.fulfilled, (state, action) => {
      state.gptList.push(action.payload);
    });
    builder.addCase(deleteGpt.fulfilled, (state, action) => {
      const id = action.payload.id;
      state.gptList = state.gptList.filter((gpt) => gpt.id != id);
    });
  },
});

export const { initGptList, addGptList } = gptSlice.actions;

export default gptSlice.reducer;
