import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { IconBrandGoogle } from "@tabler/icons-react";
import { Navigate, Link } from "react-router-dom";
// Importing component
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { ErrorMessage } from "../../../components/register/ErrorMessage";

// Importing Contexts
import { useAuth } from "@/contexts/authContext";

// Importing Auth Functions
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from "@/firebase/auth";

export function LoginFormDemo() {
  const { userLoggedIn, userId } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInError, setSignInError] = useState("");

  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSignInError("");

    if (!email || !password) {
      setSignInError("Please fill in all fields.");
      return;
    }

    if (!isSigningIn) {
      try {
        setIsSigningIn(true);
        await doSignInWithEmailAndPassword(email, password);
        setSignInError(""); // Clear error on successful sign in
        // Redirect to dashboard or home page after successful login if necessary
      } catch (error) {
        console.error(error);
        setIsSigningIn(false); // Update signing in state upon error

        // Check the error code and set a user-friendly error message
        if (error.code === "auth/invalid-credential") {
          setSignInError(
            "The credentials you provided are invalid. Please try again."
          );
        } else {
          // For other errors, you may want to display a generic error message
          setSignInError(
            "Failed to sign in. Please check your credentials and try again."
          );
        }
      }
    }
  };

  const handleGoogleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      await doSignInWithGoogle();
      setIsSigningIn(false);
    }
  };

  return (
    <div>
      {userLoggedIn && userId && <Navigate to={`/${userId}`} replace={true} />}
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Welcome Back!
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Login
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="example@gmail.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder=""
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button" // Ensure the button does not submit the form
              onClick={togglePasswordVisibility}
              style={{ background: "none", border: "none" }}
            >
              {passwordVisible ? <FiEyeOff /> : <FiEye />}
            </button>
          </LabelInputContainer>
          {signInError ? <ErrorMessage text={signInError} /> : <></>}
          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full my-8 text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            {isSigningIn ? "Signing In..." : "Sign In"}
            <BottomGradient />
          </button>
          <p className="text-center text-sm dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              to={"/signup"}
              className="hover:underline font-bold dark:text-white text-blue-500"
            >
              Sign up
            </Link>
          </p>
          <div className="flex flex-row text-center w-full my-4 dark:text-gray-400">
            <div className="border-b-2 border-gray-500 mb-2.5 mr-2 w-full"></div>
            <div className="text-sm font-bold w-fit">OR</div>
            <div className="border-b-2 border-gray-500 mb-2.5 ml-2 w-full"></div>
          </div>

          <div className="flex flex-col">
            <button
              onClick={(e) => handleGoogleSignIn(e)}
              className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
              type="button"
            >
              <IconBrandGoogle className="w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                Login in with Google
              </span>
              <BottomGradient />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
