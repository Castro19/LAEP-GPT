import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { authActions, store, useAppDispatch } from "./redux/index.ts";
import { ProfilePage } from "./pages/ProfilePage.tsx";
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
import InterestDropdown from "./components/register/SignInFlow/InterestDropdown.tsx";
import Terms from "./components/register/SignInFlow/Terms.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import NewUserRoute from "./components/security/NewUserRoute.tsx";
import SplashPage from "./pages/SplashPage.tsx";
import ProfilePageLayout from "./components/layout/ProfilePage.tsx/ProfilePageLayout.tsx";
import courses from "./calpolyData/courses.json";
import interests from "./calpolyData/interests.json";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SplashPage />,
  },
  {
    path: "/chat",
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
    element: (
      <NewUserRoute>
        <SignInFlow />
      </NewUserRoute>
    ),
    children: [
      {
        path: "about-me",
        element: <AboutMe />,
      },
      {
        path: "interests",
        element: <InterestDropdown name="Interests" items={interests} />,
      },
      {
        path: "courses",
        element: (
          <InterestDropdown
            name="Courses"
            items={courses.map(
              (course) => `CSC${course.number}: ${course.title}`
            )}
          />
        ),
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
    path: "/user/:userId",
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
    path: "/user/:userId/gpts",
    element: (
      <ProtectedRoute>
        <GPTLayout>
          <GPTPage />
        </GPTLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/user/:userId/gpts/editor",
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
        <ProfilePageLayout>
          <ProfilePage />
        </ProfilePageLayout>
      </ProtectedRoute>
    ),
  },
]);

// Create the App component
// eslint-disable-next-line react-refresh/only-export-components
function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(authActions.checkAuthentication());
  }, [dispatch]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
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
