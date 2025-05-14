import { configureStore } from "@reduxjs/toolkit";
import { messageReducer } from "./message/messageSlice";
import { assistantReducer } from "./assistant/assistantSlice";
import { layoutReducer } from "./layout/layoutSlice";
import { logReducer } from "./log/logSlice";
import { authReducer } from "./auth/authSlice";
import { userReducer } from "./user/userSlice";
import { flowchartReducer } from "./flowchart/flowchartSlice";
import { flowSelectionReducer } from "./flowSelection/flowSelectionSlice";
import { classSearchReducer } from "./classSearch/classSearchSlice";
import { sectionSelectionReducer } from "./sectionSelection/sectionSelectionSlice";
import { scheduleReducer } from "./schedule/scheduleSlice";
import { scheduleBuilderLogReducer } from "./scheduleBuilderLog/scheduleBuilderLog";

const store = configureStore({
  reducer: {
    message: messageReducer,
    assistant: assistantReducer,
    layout: layoutReducer,
    log: logReducer,
    auth: authReducer,
    user: userReducer,
    flowchart: flowchartReducer,
    flowSelection: flowSelectionReducer,
    classSearch: classSearchReducer,
    sectionSelection: sectionSelectionReducer,
    schedule: scheduleReducer,
    scheduleBuilderLog: scheduleBuilderLogReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
