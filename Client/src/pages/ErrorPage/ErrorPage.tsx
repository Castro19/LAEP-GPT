import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SplashLayout from "@/components/layout/splashPage/SplashLayout";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <SplashLayout>
      <div className="bg-slate-900 relative">
        {/* SVG Background Overlay */}
        <svg
          width="100%"
          height="50%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute top-0 left-0 z-0"
          style={{ opacity: 0.3 }}
        >
          <polygon points="0,0 60,0 0,100" fill="#1f2937" />
        </svg>

        {/* Main Content Container */}
        <section className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white p-8">
            SORRY
          </h1>
          <img 
            src="/imgs/errorPic.png" 
            alt="Error illustration" 
            className="w-1/5 min-w-[18rem] mb-6"
          />
          <p className="text-2xl text-gray-700 dark:text-gray-200 mb-6">
            We couldn't find that page
          </p>
          <div className="text-lg mb-8 text-gray-700 dark:text-gray-300">
            <p className="mb-4">404: Page not found</p>
            <Button 
              variant="default" 
              onClick={() => navigate("/chat")}
              className="hover:bg-slate-700"
            >
              Back to Homepage
            </Button>
          </div>
        </section>

        {/* Bottom SVG Decorations */}
        <div className="flex flex-col border-t border-zinc-800 text-center text-gray-400 relative">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute top-0 left-0 z-0"
            style={{ opacity: 0.1 }}
          >
            <polygon points="0,0 30,0 0,100" fill="#1f2937" />
          </svg>
        </div>
      </div>
    </SplashLayout>
  );
};

export default ErrorPage;
