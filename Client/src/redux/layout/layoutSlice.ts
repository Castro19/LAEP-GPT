import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LayoutSliceType } from "@/types";

const initialState: LayoutSliceType = {
  isSidebarVisible: false,
  currentChatId: null,
  isNewChat: true,
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    toggleSidebar(state, action: PayloadAction<boolean>) {
      state.isSidebarVisible = action.payload;
    },
    setCurrentChatId(state, action: PayloadAction<string | null>) {
      state.currentChatId = action.payload;
    },
    toggleNewChat(state, action: PayloadAction<boolean>) {
      state.isNewChat = action.payload;
    },
  },
});

export const { toggleSidebar, setCurrentChatId, toggleNewChat } =
  layoutSlice.actions;

export const layoutReducer = layoutSlice.reducer;
