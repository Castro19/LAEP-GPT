import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AssistantSliceType, AssistantType } from "@polylink/shared/types";
import { serverUrl } from "@/helpers/getEnvironmentVars";

// Read
export const fetchAll = createAsyncThunk<
  AssistantType[],
  undefined,
  { rejectValue: string }
>("assistant/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${serverUrl}/assistants`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const responseData = await response.json();
    if (!responseData) {
      throw new Error("Failed to fetch assistants");
    }
    return responseData as AssistantType[];
  } catch (error) {
    return rejectWithValue("An error occurred");
  }
});

const defaultModel: AssistantType = {
  id: "",
  title: "Calpoly SLO",
  desc: "A helpful assistant to help answer any questions you have regarding Calpoly SLO!",
  urlPhoto: "https://live.staticflickr.com/65535/53736681383_5cc3b12e54_n.jpg",
  suggestedQuestions: [
    "What's a good place for coffee near campus?",
    "How do I join a club?",
  ],
};

const initialState: AssistantSliceType = {
  assistantList: [],
  currentModel: defaultModel,
  isLoading: false,
  error: null,
  lastCreatedGpt: undefined, // store the last created GPT for undo
};

const assistantSlice = createSlice({
  name: "assistant",
  initialState,
  reducers: {
    setCurrentAssistant: (state, action: PayloadAction<string>) => {
      const newModel = state.assistantList.find(
        (asst) => asst.id === action.payload
      );
      if (newModel) {
        state.currentModel = {
          ...newModel,
          urlPhoto: newModel.urlPhoto || "",
          suggestedQuestions: newModel.suggestedQuestions || [],
        };
      } else {
        state.currentModel = defaultModel;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAll.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAll.fulfilled, (state, action) => {
      state.isLoading = false;
      state.assistantList = action.payload;
    });
    builder.addCase(fetchAll.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "An error occurred";
    });
  },
});

export const { setCurrentAssistant } = assistantSlice.actions;

export const assistantReducer = assistantSlice.reducer;
