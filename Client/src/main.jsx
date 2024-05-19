import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
// Pages
import Register from "./pages/register/Register.tsx";
import AddInfoForm from "./pages/register/signup/AddInfoForm.jsx";
import { SignupFormDemo } from "./pages/register/signup/SignUpForm.tsx";
import { LoginFormDemo } from "./pages/register/login/LoginForm.tsx";
import ChatPage from "./pages/ChatPage.jsx";
import GPTPage from "./pages/customGPT/GPTPage.jsx";
import ErrorPage from "./pages/ErrorPage/ErrorPage.jsx";
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
    path: "bots",
    element: <GPTPage />,
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
