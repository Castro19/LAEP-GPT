// HomePage.tsx
import TitleCard from "@/components/register/TitleCard";
import { Outlet } from "react-router-dom";

const Register = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 ">
      <div className="flex w-full max-w-4xl bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden border border-slate-500">
        {/* Left Side: Title and Description Component */}
        <TitleCard
          title="Welcome!"
          description="Sign in & get access to the AI4ESJ Chatbot!"
        />
        {/* Right Side: Login or Signup Form based on route */}
        <div className="w-1/2 flex flex-col justify-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Register;
