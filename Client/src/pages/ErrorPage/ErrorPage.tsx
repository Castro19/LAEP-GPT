import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SplashLayout from "@/components/layout/splashPage/SplashLayout";

const ErrorPage = () => {
  const navigate = useNavigate();
  const ERROR_TEXT = {
    title: "404",
    subtitle: "Page Not Found",
    description: "The page you're looking for doesn't exist or has been moved.",
    homeButtonText: "Go Home",
    backButtonText: "Go Back",
  };

  return (
    <SplashLayout>
      <div className="bg-background dark:bg-background min-h-screen flex items-center justify-center -mt-20">
        <div className="text-center space-y-4 w-full max-w-[40rem] px-6">
          <div className="space-y-4">
            <h1
              className="text-8xl font-extrabold text-gray-700 dark:text-gray-500"
              aria-label="404 error"
            >
              {ERROR_TEXT.title}
            </h1>
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 dark:text-gray-200">
              {ERROR_TEXT.subtitle}
            </h2>
          </div>

          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">
            {ERROR_TEXT.description}
          </p>

          <div className="flex flex-col lg:flex-row gap-3 justify-center pt-5">
            <Button
              variant="default"
              onClick={() => navigate(-1)}
              className="w-full lg:w-[20rem] hover:bg-card text-xl lg:text-2xl py-8 lg:py-10 px-12"
              aria-label="Go back to previous page"
            >
              {ERROR_TEXT.backButtonText}
            </Button>
            <Button
              variant="default"
              onClick={() => navigate("/chat")}
              className="w-full lg:w-[20rem] hover:bg-slate-700 text-xl lg:text-2xl py-8 lg:py-10 px-12"
              aria-label="Go to home page"
            >
              {ERROR_TEXT.homeButtonText}
            </Button>
          </div>
        </div>
      </div>
    </SplashLayout>
  );
};

export default ErrorPage;
