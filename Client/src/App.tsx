import * as Sentry from "@sentry/react";
import { useEffect } from "react";
import {
  createBrowserRouter,
  createRoutesFromChildren,
  matchRoutes,
  RouterProvider,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import { authActions, useAppDispatch } from "@/redux";
import "./index.css";

// Wrappers
import ProtectedRoute from "@/components/security/ProtectedRoute.tsx";
import NewUserRoute from "@/components/security/NewUserRoute.tsx";

// Pages
import SplashPage from "@/pages/SplashPage.tsx";
import Register from "@/pages/register/Register.tsx";
import ChatPage from "@/pages/ChatPage.tsx";
import ProfilePage from "@/pages/ProfilePage.tsx";
import TeamPage from "@/pages/TeamPage.tsx";
import AboutPage from "@/pages/AboutPage.tsx";
import ComingSoonPage from "@/pages/ComingSoonPage.tsx";
import FlowChartPage from "@/pages/FlowchartPage.tsx";
import ClassSearchPage from "@/pages/ClassSearchPage.tsx";
import CalendarPage from "@/pages/CalendarPage.tsx";
import ErrorPage from "@/pages/ErrorPage/ErrorPage.tsx";

// Auth
import FirebaseAuth from "@/pages/register/FirebaseAuth.tsx";
import SignUpForm from "@/pages/register/SignUpForm.tsx";
import LoginForm from "@/pages/register/LoginForm.tsx";
import { VerifyEmail } from "@/pages/register/VerifyEmail.tsx";
import ResetPassword from "@/pages/register/ResetPassword.tsx";

// Register
import { Demographics } from "@/components/register/SignInFlow/Demographics.tsx";
import { Interests } from "@/components/register/SignInFlow/Interests.tsx";
import BasicInformation from "@/components/register/SignInFlow/BasicInformation.tsx";
import InputInformation from "@/components/register/SignInFlow/InputInformation.tsx";

// Loaders
import { getTeamMembers } from "@/components/splashPage/team/helpers/getTeamMembers.ts";

// UI Components
import { Toaster } from "@/components/ui/toaster.tsx";

// My Components
import { Flowchart } from "@/components/flowchart";

// Environment
import { environment } from "@/helpers/getEnvironmentVars.ts";

// Constants
import Terms from "@/components/register/SignInFlow/Terms.tsx";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ErrorPageChosen: React.ComponentType<any> = ErrorPage;
let routerChosen: typeof createBrowserRouter = createBrowserRouter;
if (environment === "production") {
  Sentry.init({
    dsn: "https://24a74de9a44215714cb50584c4dee9f6@o4508270569259008.ingest.us.sentry.io/4508270642528256",
    integrations: [
      Sentry.reactRouterV6BrowserTracingIntegration({
        useEffect: useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
    ],
    tracesSampleRate: 1.0,
    enabled: environment === "production",
    // enabled: true,
  });
  ErrorPageChosen = Sentry.withSentryReactRouterV6Routing(ErrorPage);
  routerChosen = Sentry.wrapCreateBrowserRouter(createBrowserRouter);
}

const router = routerChosen([
  {
    path: "/",
    element: <SplashPage />,
    errorElement: <ErrorPageChosen />,
  },
  {
    element: <ProtectedRoute />, // Wrap protected routes
    errorElement: <ErrorPageChosen />,
    children: [
      {
        path: "chat",
        element: <ChatPage />,
        children: [
          {
            path: ":chatId",
            element: <ChatPage />,
          },
        ],
      },
      {
        path: "profile/edit",
        element: <ProfilePage />,
      },
      {
        path: "flowchart",
        element: <FlowChartPage />,
        children: [
          {
            path: ":flowchartId",
            element: <Flowchart />,
          },
        ],
      },
      {
        path: "class-search",
        element: <ClassSearchPage />,
      },
      {
        path: "calendar",
        element: <CalendarPage />,
        children: [
          {
            path: ":calendarId",
            element: <CalendarPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <ErrorPageChosen />,
    children: [
      {
        path: "login",
        element: <LoginForm />,
      },
      {
        path: "sign-up",
        element: <SignUpForm />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "verify-email",
    element: <VerifyEmail />,
  },
  {
    path: "coming-soon",
    element: <ComingSoonPage />,
  },
  {
    path: "team",
    element: <TeamPage />,
    loader: getTeamMembers,
  },
  {
    path: "about",
    element: <AboutPage />,
  },
  {
    path: "/auth",
    element: <FirebaseAuth />,
  },
  {
    path: "/sign-in-flow",
    element: <NewUserRoute />,
    errorElement: <ErrorPageChosen />,
    children: [
      {
        path: "terms",
        element: <Terms />,
      },
      {
        path: "input-information",
        element: <InputInformation />,
      },
      {
        path: "basic-information",
        element: <BasicInformation showStartingYear={false} />,
      },
      {
        path: "demographics",
        element: <Demographics />,
      },
      {
        path: "interests",
        element: <Interests />,
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
