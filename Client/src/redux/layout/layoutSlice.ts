import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LayoutSliceType } from "@polylink/shared/types";

const initialState: LayoutSliceType = {
  isSidebarVisible: true,
  isDropdownVisible: false,
  toggleMenu: false,
  scrollTrigger: false,
  inputFieldFocus: false,
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
    toggleMenu(state, action: PayloadAction<boolean>) {
      state.toggleMenu = action.payload;
    },
    setScrollTrigger(state, action: PayloadAction<boolean>) {
      state.scrollTrigger = action.payload;
    },
    setInputFieldFocus(state, action: PayloadAction<boolean>) {
      state.inputFieldFocus = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  toggleDropdown,
  toggleMenu,
  setScrollTrigger,
  setInputFieldFocus,
} = layoutSlice.actions;

export const layoutReducer = layoutSlice.reducer;
