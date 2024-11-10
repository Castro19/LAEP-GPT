import * as Sentry from "@sentry/react";
import React, { useEffect } from "react";
import { authActions, useAppDispatch } from "./redux/index.ts";
import { ProfilePage } from "./pages/ProfilePage.tsx";
import {
  createBrowserRouter,
  createRoutesFromChildren,
  matchRoutes,
  RouterProvider,
  useLocation,
  useNavigationType,
} from "react-router-dom";
// Pages
import Register from "./pages/register/Register.tsx";
import ChatPage from "./pages/ChatPage.js";
// import GPTPage from "./pages/customGPT/GPTPage.js";
// import GPTEditor from "./pages/customGPT/GPTEditorPage.js";
// import GPTLayout from "./components/layout/gpt/GPTLayout.js";
import ErrorPage from "./pages/ErrorPage/ErrorPage.js";
// Page Layout
// Auth
import ProtectedRoute from "./components/security/ProtectedRoute.tsx";
import "./index.css";
// import SignInFlow from "./components/register/SignInFlow";
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

Sentry.init({
  dsn: "https://24a74de9a44215714cb50584c4dee9f6@o4508270569259008.ingest.us.sentry.io/4508270642528256",
  integrations: [
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect: React.useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
  ],
  tracesSampleRate: 1.0,
  enabled: true,
});
// const SentryErrorPage = Sentry.withSentryReactRouterV6Routing(ErrorPage);

const sentryCreateBrowserRouter =
  Sentry.wrapCreateBrowserRouter(createBrowserRouter);
const router = sentryCreateBrowserRouter([
  {
    path: "/",
    element: <SplashPage />,
    errorElement: <ErrorPage />,
  },
  {
    element: <ProtectedRoute />, // Wrap protected routes
    children: [
      {
        path: "chat",
        element: <ChatPage />,
        children: [
          // loader possiblby here to fetch the messages associated with the chatlog ID
          {
            path: ":chatId",
            element: <ChatPage />,
          },
        ],
      },
      {
        path: "profile/edit/:userId",
        element: (
          <ProfilePageLayout>
            <ProfilePage />
          </ProfilePageLayout>
        ),
      },
      // {
      //   path: "gpts",
      //   element: (
      //     <GPTLayout>
      //       <GPTPage />
      //     </GPTLayout>
      //   ),
      // },
      // {
      //   path: "gpts/editor",
      //   element: (
      //     <GPTLayout>
      //       <GPTEditor />
      //     </GPTLayout>
      //   ),
      // },
    ],
  },
  {
    path: "/login",
    element: <Register />,
  },
  {
    path: "/sign-in-flow",
    element: <NewUserRoute />,
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
]);

let hasCheckedAuth = false;
function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (hasCheckedAuth) return;
    hasCheckedAuth = true;

    dispatch(authActions.checkAuthentication());
  }, [dispatch]);

  return (
    <Sentry.ErrorBoundary fallback={<ErrorPage />}>
      <RouterProvider router={router} />
      <Toaster />
    </Sentry.ErrorBoundary>
  );
}

export default App;
