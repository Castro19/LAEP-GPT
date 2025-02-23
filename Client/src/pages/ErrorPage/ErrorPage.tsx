import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SplashLayout from "@/components/layout/splashPage/SplashLayout";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <SplashLayout>
      <main 
        className="bg-slate-900 dark:bg-slate-900 min-h-screen flex items-center justify-center -mt-20"
        role="main"
      >
        <div className="text-center space-y-4 w-full max-w-[17.5rem] lg:max-w-[36rem] pr-4 pl-4">
          <div className="space-y-2">
            <h1 className="text-5xl font-extrabold text-gray-700 dark:text-gray-500" 
                aria-label="404 error">
              404
            </h1>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Page Not Found
            </h2>
          </div>
          
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          
          <div className="flex flex-col lg:flex-row gap-3 justify-center pt-5">
            <Button 
              variant="default" 
              onClick={() => navigate(-1)}
              className="w-full lg:w-auto hover:bg-slate-800 text-xl py-8 px-12"
              aria-label="Go back to previous page"
            >
              Go Back
            </Button>
            <Button 
              variant="default" 
              onClick={() => navigate("/chat")}
              className="w-full lg:w-auto hover:bg-slate-700 text-xl py-8 px-12"
              aria-label="Go to home page"
            >
              Home
            </Button>
          </div>
        </div>
      </main>
    </SplashLayout>
  );
};

export default ErrorPage;
