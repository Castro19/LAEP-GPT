import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isSidebarVisible: false,
  currentChatId: null,
  isNewChat: true,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state, action) {
      state.isSidebarVisible = action.payload;
    },
    setCurrentChatId(state, action) {
      state.currentChatId = action.payload;
    },
    toggleNewChat(state, action) {
      state.isNewChat = action.payload;
    },
  },
});

export const { toggleSidebar, setCurrentChatId, toggleNewChat } =
  uiSlice.actions;

export default uiSlice.reducer;
