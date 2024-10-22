import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { authActions, store, useAppDispatch } from "./redux/index.ts";
import ProfilePage from "./pages/register/ProfilePage.tsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
// Pages
import Register from "./pages/register/Register.tsx";
import ChatPage from "./pages/ChatPage.js";
import GPTPage from "./pages/customGPT/GPTPage.js";
import GPTEditor from "./pages/customGPT/GPTEditorPage.js";
import ErrorPage from "./pages/ErrorPage/ErrorPage.js";
// Page Layout
import GPTLayout from "./components/layout/gpt/GPTLayout.js";
// Auth
import ProtectedRoute from "./components/security/ProtectedRoute.tsx";
import "./index.css";
import SignInFlow from "./components/register/SignInFlow";
import AboutMe from "./components/register/SignInFlow/AboutMe.tsx";
import WeeklyCalendar from "./components/register/WeeklyCalendar.tsx";
import InterestDropdown from "./components/register/InterestDropdown.tsx";
import Terms from "./components/register/SignInFlow/Terms.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <ChatPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Register />,
  },
  {
    path: "/sign-in-flow",
    element: <SignInFlow />,
    children: [
      {
        path: "about-me",
        element: <AboutMe />,
      },
      {
        path: "interests",
        element: <InterestDropdown />,
      },
      {
        path: "availability",
        element: <WeeklyCalendar />,
      },
      {
        path: "terms",
        element: <Terms />,
      },
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
    path: "/profile/edit/:userId",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
]);

// Create the App component
// eslint-disable-next-line react-refresh/only-export-components
function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(authActions.listenToAuthChanges());
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
}
