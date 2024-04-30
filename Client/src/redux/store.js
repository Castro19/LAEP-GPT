import { configureStore } from "@reduxjs/toolkit";
import modelReducer from "./chatModel/modelSlice";
import uiReducer from "./ui/uiSlice";
import messageReducer from "./message/messageSlice";

export const store = configureStore({
  reducer: {
    model: modelReducer,
    ui: uiReducer,
    message: messageReducer,
  },
});

export default store;
