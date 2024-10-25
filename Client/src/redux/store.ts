import { configureStore } from "@reduxjs/toolkit";
import { messageReducer } from "./message/messageSlice";
import { gptReducer } from "./gpt/gptSlice";
import { layoutReducer } from "./layout/layoutSlice";
import { logReducer } from "./log/logSlice";
import { authReducer } from "./auth/authSlice";
import { userReducer } from "./user/userSlice";

const store = configureStore({
  reducer: {
    message: messageReducer,
    gpt: gptReducer,
    layout: layoutReducer,
    log: logReducer,
    auth: authReducer,
    user: userReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
