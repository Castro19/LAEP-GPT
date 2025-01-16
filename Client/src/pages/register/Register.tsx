// HomePage.tsx
import SplashLayout from "@/components/layout/splashPage/SplashLayout";
import TitleCard from "@/components/register/TitleCard";

import useMobile from "@/hooks/use-mobile";
import { Outlet } from "react-router-dom";

const Register = () => {
  const isMobile = useMobile();

  return (
    <SplashLayout>
      <div className="flex items-center justify-center min-h-[50vh] my-20">
        <div className="flex w-11/12 max-w-4xl bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden border border-slate-500">
          {/* Left Side: Title and Description Component */}
          {!isMobile && (
            <div className="w-1/2">
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
      </div>
    </SplashLayout>
  );
};

export default Register;
