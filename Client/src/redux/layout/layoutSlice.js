import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isSidebarVisible: false,
  currentChatId: null,
  isNewChat: true,
};

const layoutSlice = createSlice({
  name: "layout",
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
  layoutSlice.actions;

export default layoutSlice.reducer;
