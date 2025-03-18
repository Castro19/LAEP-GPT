// HomePage.tsx
import SplashLayout from "@/components/layout/splashPage/SplashLayout";
import TitleCard from "@/components/register/TitleCard";
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const Register = () => {
  const isMobile = useIsNarrowScreen();

  return (
    <SplashLayout>
      {/* Outer container using bg-slate-900 to match your splash page */}
      <div className="relative flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
        {/* SVG decorations (dark, subtle) */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none select-none overflow-hidden">
          {/* Top-left triangle */}
          <svg
            className="absolute w-[380px] h-[380px] text-slate-600 opacity-10 top-[-120px] left-[-120px]"
            fill="currentColor"
            viewBox="0 0 512 512"
          >
            <polygon points="0,0 512,0 0,512" />
          </svg>

          {/* Bottom-right rounded square */}
          <svg
            className="absolute w-[540px] h-[540px] text-slate-700 opacity-10 bottom-[-200px] right-[-180px] rotate-45"
            fill="currentColor"
            viewBox="0 0 512 512"
          >
            <rect width="512" height="512" rx="80" ry="80" />
          </svg>

          {/* Additional decorative elements */}
          <svg
            className="absolute w-[300px] h-[300px] text-slate-600 opacity-10 top-[20%] right-[-50px]"
            fill="currentColor"
            viewBox="0 0 512 512"
          >
            <circle cx="256" cy="256" r="256" />
          </svg>

          <svg
            className="absolute w-[250px] h-[250px] text-slate-700 opacity-10 bottom-[10%] left-[-50px] rotate-12"
            fill="currentColor"
            viewBox="0 0 512 512"
          >
            <path d="M256,0 L512,256 L256,512 L0,256 Z" />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center my-20 w-full px-4"
        >
          <div
            className={`flex w-full ${
              isMobile ? "max-w-lg" : "max-w-6xl"
            } bg-gradient-to-br from-zinc-800/95 via-zinc-800 to-slate-800 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-lg shadow-2xl overflow-hidden border border-slate-600/50`}
          >
            {/* Left Side: Title and Description Component */}
            {!isMobile && (
              <div className="w-1/2 border-r border-slate-600/50">
                <TitleCard
                  title="Welcome!"
                  description="Sign in & get access to PolyLink"
                />
              </div>
            )}
            {/* Right Side: Login or Signup Form based on route */}
            <div className={`${isMobile ? "w-full" : "w-1/2"} p-8`}>
              <Outlet />
            </div>
          </div>
        </motion.div>
      </div>
    </SplashLayout>
  );
};

export default Register;
