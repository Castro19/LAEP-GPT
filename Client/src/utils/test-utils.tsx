import React, { PropsWithChildren } from "react";
import { render, RenderOptions, RenderResult } from "@testing-library/react";
import { Provider } from "react-redux";
import { Store } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import store, { RootState } from "../redux/store";
import { messageReducer } from "../redux/message/messageSlice";
import { assistantReducer } from "../redux/assistant/assistantSlice";
import { layoutReducer } from "../redux/layout/layoutSlice";
import { logReducer } from "../redux/log/logSlice";
import { authReducer } from "../redux/auth/authSlice";
import { userReducer } from "../redux/user/userSlice";
import { flowchartReducer } from "../redux/flowchart/flowchartSlice";
import { flowSelectionReducer } from "../redux/flowSelection/flowSelectionSlice";
import { classSearchReducer } from "../redux/classSearch/classSearchSlice";
import { sectionSelectionReducer } from "../redux/sectionSelection/sectionSelectionSlice";
import { scheduleReducer } from "../redux/schedule/scheduleSlice";
import { scheduleBuilderLogReducer } from "../redux/scheduleBuilderLog/scheduleBuilderLogSlice";
import { errorReducer } from "../redux/error/errorSlice";

interface CustomRenderOptions {
  preloadedState?: Partial<RootState>;
  store?: Store<RootState>;
}

interface CustomRenderResult extends RenderResult {
  store: Store<RootState>;
}

const rootReducer = {
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
  error: errorReducer,
};

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store: customStore,
    ...renderOptions
  }: CustomRenderOptions & Omit<RenderOptions, "wrapper"> = {}
): CustomRenderResult {
  // Create a fresh store for each test
  const testStore =
    customStore ||
    configureStore({
      reducer: rootReducer,
      preloadedState: {
        ...store.getState(),
        ...preloadedState,
      },
    });

  function Wrapper({ children }: PropsWithChildren): JSX.Element {
    return <Provider store={testStore}>{children}</Provider>;
  }

  return {
    store: testStore,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
