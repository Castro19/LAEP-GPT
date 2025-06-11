import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SplashLayout from "@/components/layout/splashPage/SplashLayout";
import ReportError from "@/components/errorPage/ReportError";
import { IoBugOutline } from "react-icons/io5";

const ERROR_TEXT = {
  title: "404",
  subtitle: "Page Not Found",
  description: "The page you're looking for doesn't exist or has been moved.",
  homeButtonText: "Go Home",
  backButtonText: "Go Back",
};
const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <SplashLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 max-w-5xl w-full text-center space-y-6">
          <IoBugOutline
            className="mx-auto text-7xl text-red-500"
            aria-hidden="true"
          />

          <h1 className="text-6xl font-extrabold text-gray-900 dark:text-gray-100">
            {ERROR_TEXT.title}
          </h1>

          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
            {ERROR_TEXT.subtitle}
          </h2>

          <p className="text-base text-gray-600 dark:text-gray-400">
            {ERROR_TEXT.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 px-6 text-sm font-medium bg-slate-900 dark:hover:bg-slate-900 text-white"
              aria-label="Go back to previous page"
            >
              {ERROR_TEXT.backButtonText}
            </Button>
            <Button
              variant="default"
              onClick={() => navigate("/")}
              className="flex-1 py-3 px-6 text-sm font-medium"
              aria-label="Go to home page"
            >
              {ERROR_TEXT.homeButtonText}
            </Button>
          </div>

          <hr className="border-gray-200 dark:border-gray-700 my-4" />

          <ReportError />
        </div>
      </div>
    </SplashLayout>
  );
};

export default ErrorPage;
