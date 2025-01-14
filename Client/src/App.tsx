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
import ChatPage from "./pages/ChatPage.tsx";
import ErrorPage from "./pages/ErrorPage/ErrorPage.tsx";
// Page Layout
// Auth
import ProtectedRoute from "./components/security/ProtectedRoute.tsx";
import "./index.css";
// import SignInFlow from "./components/register/SignInFlow";
import Terms from "./components/register/SignInFlow/Terms.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import NewUserRoute from "./components/security/NewUserRoute.tsx";
import SplashPage from "./pages/SplashPage.tsx";
import ProfilePageLayout from "./components/layout/ProfilePage/ProfilePageLayout.tsx";
import FlowChatPage from "./pages/FlowChatPage.tsx";
import FlowChartOptions from "./components/register/SignInFlow/FlowChartOptions.tsx";
import FlowChart from "./components/flowchart/FlowChart.tsx";
import SignUpForm from "./pages/register/SignUpForm.tsx";
import LoginForm from "./pages/register/LoginForm.tsx";
import { VerifyEmail } from "./pages/register/VerifyEmail.tsx";
import ResetPassword from "./pages/register/ResetPassword.tsx";
import FirebaseAuth from "./pages/register/FirebaseAuth.tsx";
import ComingSoonPage from "./pages/ComingSoonPage.tsx";
import { environment } from "./helpers/getEnvironmentVars.ts";
import TeamPage from "./pages/TeamPage.tsx";
import { getTeamMembers } from "./helpers/getTeamMembers.ts";
import { Demographics } from "./components/register/SignInFlow/Demographics.tsx";
import { Interests } from "./components/register/SignInFlow/Interests.tsx";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ErrorPageChosen: React.ComponentType<any> = ErrorPage;
let routerChosen: typeof createBrowserRouter = createBrowserRouter;
if (environment === "production") {
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
        element: (
          <ProfilePageLayout>
            <ProfilePage />
          </ProfilePageLayout>
        ),
      },
      {
        path: "flowchart",
        element: <FlowChatPage />,
        children: [
          {
            path: ":flowchartId",
            element: <FlowChart />,
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
        path: "demographics",
        element: <Demographics />,
      },
      {
        path: "interests",
        element: <Interests />,
      },
      {
        path: "flowchart",
        element: <FlowChartOptions type="signup" />,
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
