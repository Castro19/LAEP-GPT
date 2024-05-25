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

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
