import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
// Pages
import Register from "./pages/register/Register.tsx";
import { SignupFormDemo } from "./pages/register/SignUpForm.tsx";
import AddInfoForm from "./pages/register/AddInfoForm.jsx";
import { LoginFormDemo } from "./pages/register/LoginForm.tsx";
import ChatPage from "./pages/ChatPage.jsx";
import GPTPage from "./pages/customGPT/GPTPage.jsx";
import GPTEditor from "./pages/customGPT/GPTEditorPage.jsx";
import ErrorPage from "./pages/ErrorPage/ErrorPage.jsx";
// Page Layout
import GPTLayout from "./components/layout/gpt/GPTLayout.jsx";
// Loaders:
import { viewGPTs } from "./redux/gpt/crudGPT.ts";
// Auth
import ProtectedRoute from "./components/security/ProtectedRoute.jsx";
import { AuthProvider } from "./contexts/authContext/index.tsx";
import "./index.css";

// import App from "./App.jsx";
// Redux Implementation

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
    loader: viewGPTs,
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
