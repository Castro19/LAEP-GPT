import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FlowchartData } from "@polylink/shared/types";

export interface FlowchartHistory {
  undoStack: FlowchartData[];
  redoStack: FlowchartData[];
  maxHistorySize: number;
}

const initialState: FlowchartHistory = {
  undoStack: [],
  redoStack: [],
  maxHistorySize: 50, // Limit to prevent memory issues
};

const flowchartHistorySlice = createSlice({
  name: "flowchartHistory",
  initialState,
  reducers: {
    // Save current state before making changes
    saveSnapshot: (state, action: PayloadAction<FlowchartData>) => {
      state.undoStack.push(action.payload);
      state.redoStack = []; // Clear redo stack when new action is performed

      // Limit history size
      if (state.undoStack.length > state.maxHistorySize) {
        state.undoStack.shift(); // Remove oldest snapshot
      }
    },

    // Move current state to redo stack and return previous state to restore
    moveToRedo: (state, action: PayloadAction<FlowchartData>) => {
      if (state.undoStack.length > 0) {
        // Save current state to redo stack
        state.redoStack.push(action.payload);
        // Remove and return the state to restore
        state.undoStack.pop();
      }
    },

    // Move current state to undo stack and return next state to restore
    moveToUndo: (state, action: PayloadAction<FlowchartData>) => {
      if (state.redoStack.length > 0) {
        // Save current state to undo stack
        state.undoStack.push(action.payload);
        // Remove and return the state to restore
        state.redoStack.pop();
      }
    },

    clearHistory: (state) => {
      state.undoStack = [];
      state.redoStack = [];
    },
  },
});

export const { saveSnapshot, moveToRedo, moveToUndo, clearHistory } =
  flowchartHistorySlice.actions;

export const flowchartHistoryReducer = flowchartHistorySlice.reducer;
