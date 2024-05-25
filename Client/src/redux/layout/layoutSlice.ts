import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LayoutSliceType } from "@/types";

const initialState: LayoutSliceType = {
  isSidebarVisible: false,
  isDropdownVisible: false,
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    toggleSidebar(state, action: PayloadAction<boolean>) {
      state.isSidebarVisible = action.payload;
    },
    toggleDropdown(state, action: PayloadAction<boolean>) {
      state.isDropdownVisible = action.payload;
    },
  },
});

export const { toggleSidebar, toggleDropdown } = layoutSlice.actions;

export const layoutReducer = layoutSlice.reducer;
