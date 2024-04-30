import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Register from "./pages/register/Register.tsx";
import { SignupFormDemo } from "./pages/register/signup/SignUpForm.tsx";
import { LoginFormDemo } from "./pages/register/login/LoginForm.tsx";
import ChatPage from "./pages/ChatPage.jsx";
import { AuthProvider } from "./contexts/authContext/index.tsx";
import "./index.css";

// import App from "./App.jsx";
// Redux Implementation

const router = createBrowserRouter([
  {
    path: "/",
    element: <ChatPage />,
  },
  {
    path: "/register",
    element: <Register />,
    children: [
      { index: true, element: <Navigate to="signup" replace /> },
      { path: "signup", element: <SignupFormDemo /> },
      { path: "login", element: <LoginFormDemo /> },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);
