import React, { PropsWithChildren } from "react";
import { render, RenderOptions, RenderResult } from "@testing-library/react";
import { Provider } from "react-redux";
import { Store } from "@reduxjs/toolkit";
import store from "../redux/store";
import { RootState } from "../redux/store";

interface CustomRenderOptions {
  preloadedState?: Partial<RootState>;
  store?: Store<RootState>;
}

interface CustomRenderResult extends RenderResult {
  store: Store<RootState>;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store: customStore = store,
    ...renderOptions
  }: CustomRenderOptions & Omit<RenderOptions, "wrapper"> = {}
): CustomRenderResult {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={customStore}>{children}</Provider>;
  }

  return {
    store: customStore,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
