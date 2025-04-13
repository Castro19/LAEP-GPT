import React, { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { IoSchoolSharp } from "react-icons/io5";
import { Navigate, Link } from "react-router-dom";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { useAppDispatch, useAppSelector, authActions } from "@/redux";
import { ErrorMessage } from "@/components/register/ErrorMessage";
import SpecialButton from "@/components/ui/specialButton";
import {
  clearRegisterError,
  linkWithMicrosoft,
  setRegisterError,
} from "@/redux/auth/authSlice";
import { OAuthProvider } from "firebase/auth";
import { toast } from "@/components/ui/use-toast";
import { environment } from "@/helpers/getEnvironmentVars";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const { userLoggedIn, registerError, loading, pendingCredential } =
    useAppSelector((state) => state.auth);

  const handleOutlookSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(authActions.signInWithMicrosoft());
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLinkMicrosoft = () => {
    if (pendingCredential) {
      const cred = OAuthProvider.credentialFromJSON(pendingCredential);
      dispatch(linkWithMicrosoft({ pendingCred: cred }))
        .unwrap()
        .then(() => {
          // Successfully linked
          // Optionally clear pending credential if not done in the reducer
        })
        .catch((error) => {
          if (environment === "dev") {
            console.error("Failed to link Microsoft:", error);
          }
        });

      toast({
        title: "Microsoft linked successfully",
        description: "You can now sign in with Microsoft",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(setRegisterError(""));

    if (!email || !password) {
      dispatch(authActions.setRegisterError("Please fill in all fields."));
      return;
    }

    try {
      await dispatch(authActions.signInWithEmail({ email, password })).unwrap();
      handleLinkMicrosoft();
    } catch (error) {
      if (environment === "dev") {
        console.error("Error signing in with email: ", error);
      }
    }
  };

  useEffect(() => {
    dispatch(clearRegisterError());
  }, [dispatch]);

  return (
    <div>
      <Helmet>
        <title>Login | Polylink</title>
        <meta
          name="description"
          content="Sign in to PolyLink to access your Cal Poly course planning tools, schedule builder, and connect with your campus community. Login with your Cal Poly account or email."
        />

        {/* OpenGraph Image Tags */}
        <meta property="og:image" content="/seo-login.png" />
        <meta property="og:title" content="Login | PolyLink" />
        <meta
          property="og:description"
          content="Sign in to PolyLink to access your Cal Poly course planning tools."
        />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/seo-login.png" />
        <meta name="twitter:title" content="Login | PolyLink" />
        <meta
          name="twitter:description"
          content="Sign in to PolyLink to access your Cal Poly course planning tools."
        />
      </Helmet>
      {userLoggedIn && <Navigate to={`/chat`} replace={true} />}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full mx-auto"
      >
        <h2 className="font-bold text-2xl text-neutral-200 mb-2">
          Welcome Back!
        </h2>
        <p className="text-neutral-400 text-sm max-w-sm mb-8">
          Log in with your school email
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <LabelInputContainer>
            <Label htmlFor="email" className="text-neutral-200">
              Email Address
            </Label>
            <Input
              id="email"
              placeholder="example@calpoly.edu"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-neutral-800/50 border-neutral-700 text-neutral-200 placeholder:text-neutral-500 focus:border-blue-500"
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="password" className="text-neutral-200">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                placeholder="Enter your password"
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-neutral-800/50 border-neutral-700 text-neutral-200 placeholder:text-neutral-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-300 transition-colors"
                style={{ background: "none", border: "none" }}
              >
                {passwordVisible ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </LabelInputContainer>

          <div className="flex justify-end">
            <Link
              to={"/register/reset-password"}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg py-2.5 font-medium shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            type="submit"
          >
            {loading ? "Signing In..." : "Sign In"}
          </motion.button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-neutral-900 text-neutral-400">OR</span>
            </div>
          </div>

          <SpecialButton
            onClick={handleOutlookSignIn}
            text="Login with Cal Poly Account"
            icon={<IoSchoolSharp className="text-xl" />}
            className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700"
          />

          <div className="text-center">
            <p className="text-neutral-400 text-sm">
              Don&apos;t have an account?{" "}
              <Link
                to={"/register/sign-up"}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>

          {registerError && <ErrorMessage text={registerError} />}
        </form>
      </motion.div>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2", className)}>{children}</div>
  );
};
