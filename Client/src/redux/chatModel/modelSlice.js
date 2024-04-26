import { createSlice } from "@reduxjs/toolkit";

// 1. Create initial state
const initialState = {
  modelType: "normal",
};

// 2. Create the Slice
const modelSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    setModelType(state, action) {
      state.modelType = action.payload; // Ensure this is correct
    },
  },
});
// 3. Export our actions:
export const { setModelType } = modelSlice.actions;

// 4. Export Reducer
export default modelSlice.reducer;
