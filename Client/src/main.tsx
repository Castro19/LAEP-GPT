/* eslint-disable @typescript-eslint/no-explicit-any */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux";
import App from "./App.tsx";

const rootElement = document.getElementById("root");
if (rootElement) {
  // Check if the root is already created and stored on the window object
  if (!("__root" in window)) {
    // Create the root and store it on the window object
    (window as any).__root = createRoot(rootElement);
  }
  // Use the stored root to render
  (window as any).__root.render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  );
}
