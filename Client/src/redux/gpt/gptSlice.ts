import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createGPT, deleteGPT } from "./crudGPT";
import {
  GptSliceType,
  GptType,
  CrudErrorCodes,
  errorMessages,
  CustomErrorType,
} from "@/types";

// Create
export const addGpt = createAsyncThunk<
  GptType,
  {
    userId: string;
    title: string;
    urlPhoto: string;
    desc: string;
    instructions: string;
  },
  { rejectValue: CustomErrorType }
>("gpt/addGpt", async (gptData, { rejectWithValue }) => {
  try {
    const addGpt = await createGPT(gptData);
    if (addGpt) {
      return {
        id: addGpt.id,
        title: gptData.title,
        desc: gptData.desc,
        urlPhoto: gptData.urlPhoto,
        instructions: gptData.instructions,
      } as GptType;
    } else {
      throw new Error("Failed to create GPT");
    }
  } catch (error) {
    console.error("Failed to create GPT: ", error);
    return rejectWithValue(errorMessages[CrudErrorCodes.CREATE_FAILED]);
  }
});

// Read
export const viewGpts = createAsyncThunk<
  { gptList: GptType[] },
  { gptList: GptType[] },
  { rejectValue: CustomErrorType }
>("gpt/viewGpts", async ({ gptList }, { rejectWithValue }) => {
  try {
    return { gptList };
  } catch (error) {
    return rejectWithValue(errorMessages[CrudErrorCodes.READ_FAILED]);
  }
});

// Delete
export const deleteGpt = createAsyncThunk<
  { id: string },
  { id: string },
  { rejectValue: CustomErrorType }
>("gpt/deleteGpt", async ({ id }, { rejectWithValue }) => {
  try {
    await deleteGPT(id);
    return { id };
  } catch (error) {
    console.error("Failed to Delete GPT: ", error);
    return rejectWithValue(errorMessages[CrudErrorCodes.DELETE_FAILED]);
  }
});

const defaultModel: GptType = {
  id: "664ca3b0143d529c7bf09f23",
  title: "Normal",
  desc: "A helpful assistant to help answer any questions you have!",
  urlPhoto: "https://live.staticflickr.com/65535/53736681383_5cc3b12e54_n.jpg",
  instructions: "",
};

const initialState: GptSliceType = {
  gptList: [],
  currentModel: defaultModel,
  isLoading: false,
  error: null,
  lastCreatedGpt: undefined, // store the last created GPT for undo
};

const gptSlice = createSlice({
  name: "gpt",
  initialState,
  reducers: {
    initGptList: (state, action: PayloadAction<GptType[]>) => {
      state.gptList = action.payload;
    },
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
    builder
      .addCase(addGpt.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addGpt.fulfilled, (state, action: PayloadAction<GptType>) => {
        state.isLoading = false;
        if (action.payload) {
          state.gptList.push(action.payload);
          state.lastCreatedGpt = action.payload.id;
        }
      })
      .addCase(
        addGpt.rejected,
        (state, action: PayloadAction<CustomErrorType | undefined>) => {
          state.isLoading = false;
          state.error = action.payload
            ? action.payload.message
            : "An error occurred";
        }
      )
      .addCase(deleteGpt.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        deleteGpt.fulfilled,
        (state, action: PayloadAction<{ id: string }>) => {
          state.isLoading = false;
          const id = action.payload.id;
          state.gptList = state.gptList.filter((gpt) => gpt.id !== id);
          if (state.lastCreatedGpt === id) {
            state.lastCreatedGpt = undefined; // Clear the last created GPT if it was deleted
          }
        }
      )
      .addCase(
        deleteGpt.rejected,
        (state, action: PayloadAction<CustomErrorType | undefined>) => {
          state.isLoading = false;
          state.error = action.payload
            ? action.payload.message
            : "An error occurred";
        }
      );
  },
});

export const { initGptList, setCurrentGpt } = gptSlice.actions;

export const gptReducer = gptSlice.reducer;
