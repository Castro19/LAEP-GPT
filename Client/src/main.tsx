/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/index.ts";
import App from "./App.tsx";

const rootElement = document.getElementById("root");
if (rootElement) {
  // Check if the root is already created and stored on the window object
  if (!("__root" in window)) {
    // Create the root and store it on the window object
    (window as any).__root = ReactDOM.createRoot(rootElement);
  }
  // Use the stored root to render
  (window as any).__root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
}
