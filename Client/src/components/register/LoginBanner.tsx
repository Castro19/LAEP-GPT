import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const LoginBanner = () => {
  return (
    <div className="mb-6 p-4 rounded-lg bg-yellow-900/20 border border-yellow-800/50">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-yellow-500 font-medium mb-1">
            Microsoft Login Temporarily Unavailable
          </h3>
          <p className="text-neutral-400 text-sm mb-2">
            Due to recent IT department changes, Microsoft login is currently
            disabled. Please use email and password to sign in.
          </p>
          <Link
            to="/register/sign-up"
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors inline-flex items-center gap-1"
          >
            Create an account with email
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginBanner;
