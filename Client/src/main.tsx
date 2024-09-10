import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/index.ts";
import ProfilePage from "./pages/register/ProfilePage.tsx";

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
// Pages
import Register from "./pages/register/Register.tsx";
import { SignupFormDemo } from "./pages/register/SignUpForm.tsx";
import AddInfoForm from "./pages/register/AddInfoForm.js";
import { LoginFormDemo } from "./pages/register/LoginForm.tsx";
import { VerifyEmail } from "./pages/register/VerifyEmail.tsx";
import ChatPage from "./pages/ChatPage.js";
import GPTPage from "./pages/customGPT/GPTPage.js";
import GPTEditor from "./pages/customGPT/GPTEditorPage.js";
import ErrorPage from "./pages/ErrorPage/ErrorPage.js";
// Page Layout
import GPTLayout from "./components/layout/gpt/GPTLayout.js";
// Auth
import ProtectedRoute from "./components/security/ProtectedRoute.tsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Register />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="signup" replace /> },
      { path: "signup", element: <SignupFormDemo /> },
      { path: "login", element: <LoginFormDemo /> },
      { path: "settingForm", element: <AddInfoForm /> },
    ],
  },
  {
    // Intermediate page for email verification--user is signed in but email is not verified
    path: "/email-verification-needed",
    element: <VerifyEmail />,
  },
  {
    path: "/:userId",
    element: (
      <ProtectedRoute>
        <ChatPage />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "chat/:chatId",
        element: (
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/:userId/gpts",
    element: (
      <ProtectedRoute>
        <GPTLayout>
          <GPTPage />
        </GPTLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/:userId/gpts/editor",
    element: (
      <ProtectedRoute>
        <GPTLayout>
          <GPTEditor />
        </GPTLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/:userId",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
]);

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </React.StrictMode>
  );
}
