import { configureStore } from "@reduxjs/toolkit";
import modelReducer from "./chatModel/modelSlice";
import layoutReducer from "./layout/layoutSlice";
import messageReducer from "./chat/messageSlice";
import logReducer from "./log/logSlice";

export const store = configureStore({
  reducer: {
    model: modelReducer,
    layout: layoutReducer,
    message: messageReducer,
    log: logReducer,
  },
});

export default store;
