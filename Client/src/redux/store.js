import { configureStore } from "@reduxjs/toolkit";
import { messageReducer } from "./chat/messageSlice";
import { gptReducer } from "./gpt/gptSlice";
import { layoutReducer } from "./layout/layoutSlice";
import { logReducer } from "./log/logSlice";

const store = configureStore({
  reducer: {
    message: messageReducer,
    gpt: gptReducer,
    layout: layoutReducer,
    log: logReducer,
  },
});

export default store;
