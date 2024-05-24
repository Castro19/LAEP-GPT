import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createGPT, deleteGPT } from "./crudGPT";
import { GptSliceType, GptType, CrudErrorCodes, errorMessages } from "@/types";

// Create
export const addGpt = createAsyncThunk(
  "gpt/addGpt",
  async (
    { userId, title, urlPhoto, desc, instructions }: GptType,
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
        } as GptType; // Ensure the returned type is GptType
      } else {
        throw new Error("Failed to create GPT");
      }
    } catch (error) {
      console.error("Failed to create GPT: ", error);
      return rejectWithValue(errorMessages[CrudErrorCodes.CREATE_FAILED]);
    }
  }
);

// Read
export const viewGpts = createAsyncThunk(
  "gpt/viewGpts",
  async ({ gptList }: { gptList: GptType[] }, { rejectWithValue }) => {
    try {
      return { gptList };
    } catch (error) {
      return rejectWithValue(errorMessages[CrudErrorCodes.READ_FAILED]);
    }
  }
);

export const deleteGpt = createAsyncThunk(
  "gpt/deleteGpt",
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      await deleteGPT(id);
      return { id };
    } catch (error) {
      console.error("Failed to Delete GPT: ", error);
      return rejectWithValue(errorMessages[CrudErrorCodes.DELETE_FAILED]);
    }
  }
);

const defaultModel: GptType = {
  id: "664ca3b0143d529c7bf09f23",
  title: "Normal",
  desc: "A helpful assistant to help answer any questions you have!",
  urlPhoto: "https://live.staticflickr.com/65535/53736681383_5cc3b12e54_n.jpg",
};

const initialState: GptSliceType = {
  gptList: [],
  currentModel: defaultModel,
};

const gptSlice = createSlice({
  name: "gpt",
  initialState,
  reducers: {
    // Init the GPT List:
    initGptList: (state, action) => {
      const gptList = action.payload;
      state.gptList = gptList;
    },
    // Set our current model
    setCurrentGpt: (state, action: PayloadAction<string>) => {
      const newModel = state.gptList.find((asst) => asst.id === action.payload);
      if (newModel) {
        state.currentModel = {
          ...newModel,
          urlPhoto: newModel.urlPhoto || "",
          instructions: newModel.instructions || "",
        };
      } else {
        state.currentModel = defaultModel;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      addGpt.fulfilled,
      (state, action: PayloadAction<GptType>) => {
        if (action.payload) {
          state.gptList.push(action.payload);
        }
      }
    );
    builder.addCase(
      deleteGpt.fulfilled,
      (state, action: PayloadAction<{ id: string }>) => {
        const id = action.payload.id;
        state.gptList = state.gptList.filter((gpt) => gpt.id !== id);
      }
    );
  },
});

export const { initGptList, setCurrentGpt } = gptSlice.actions;

export const gptReducer = gptSlice.reducer;
