import { configureStore } from "@reduxjs/toolkit";
import modelReducer from "./chatModel/modelSlice";
import uiReducer from "./ui/uiSlice";
import messageReducer from "./message/messageSlice";
import logReducer from "./log/logSlice";

export const store = configureStore({
  reducer: {
    model: modelReducer,
    ui: uiReducer,
    message: messageReducer,
    log: logReducer,
  },
});

export default store;
