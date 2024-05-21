import { configureStore } from "@reduxjs/toolkit";
import layoutReducer from "./layout/layoutSlice";
import messageReducer from "./chat/messageSlice";
import logReducer from "./log/logSlice";
import gptReducer from "./gpt/gptSlice";
export const store = configureStore({
  reducer: {
    layout: layoutReducer,
    message: messageReducer,
    log: logReducer,
    gpt: gptReducer,
  },
});

export default store;
