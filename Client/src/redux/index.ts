// index.ts

// Export the configured Redux store
export { default as store } from "./store";

// Export all reducers for modular access
export { messageReducer } from "./message/messageSlice.ts";
export { assistantReducer } from "./assistant/assistantSlice.ts";
export { layoutReducer } from "./layout/layoutSlice.ts";
export { logReducer } from "./log/logSlice.ts";
export { authReducer } from "./auth/authSlice.ts";
export { userReducer } from "./user/userSlice.ts";
export { flowchartReducer } from "./flowchart/flowchartSlice.ts";
export { flowSelectionReducer } from "./flowSelection/flowSelectionSlice.ts";
export { classSearchReducer } from "./classSearch/classSearchSlice.ts";
export { sectionSelectionReducer } from "./sectionSelection/sectionSelectionSlice.ts";
export { scheduleReducer } from "./calendar/calendarSlice.ts";
// Export all actions for easy dispatching in components
export * as messageActions from "./message/messageSlice.ts";
export * as assistantActions from "./assistant/assistantSlice.ts";
export * as layoutActions from "./layout/layoutSlice.ts";
export * as logActions from "./log/logSlice.ts";
export * as authActions from "./auth/authSlice.ts";
export * as userActions from "./user/userSlice.ts";
export * as flowchartActions from "./flowchart/flowchartSlice.ts";
export * as flowSelectionActions from "./flowSelection/flowSelectionSlice.ts";
export * as classSearchActions from "./classSearch/classSearchSlice.ts";
export * as sectionSelectionActions from "./sectionSelection/sectionSelectionSlice.ts";
export * as scheduleActions from "./calendar/calendarSlice.ts";
// Custom hooks for using dispatch and selector with TypeScript
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "./store";

/**
 * Custom hook to use the dispatch function with the correct TypeScript type
 * @returns {AppDispatch} The typed dispatch function
 */
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

/**
 * Custom hook to use the selector function with the correct TypeScript type
 * @returns {TypedUseSelectorHook<RootState>} The typed selector function
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
