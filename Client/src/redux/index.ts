// index.ts

// Export the configured Redux store
export { default as store } from "./store";

// Export all reducers for modular access
export { messageReducer } from "./chat/messageSlice";
export { gptReducer } from "./gpt/gptSlice";
export { layoutReducer } from "./layout/layoutSlice.ts";
export { logReducer } from "./log/logSlice.ts";
export { authReducer } from "./auth/authSlice.ts";

// Export all actions for easy dispatching in components
export * as messageActions from "./chat/messageSlice";
export * as gptActions from "./gpt/gptSlice";
export * as layoutActions from "./layout/layoutSlice.ts";
export * as logActions from "./log/logSlice.ts";
export * as authActions from "./auth/authSlice.ts";
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
