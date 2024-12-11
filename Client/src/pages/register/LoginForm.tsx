import React, { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { IoSchoolSharp } from "react-icons/io5";
import { Navigate, Link } from "react-router-dom";
// Importing component
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
// redux auth:
import { useAppDispatch, useAppSelector, authActions } from "@/redux";
// Helper Components
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

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  // Maybe add
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
      {userLoggedIn && <Navigate to={`/chat`} replace={true} />}
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input dark:bg-zinc-800">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Welcome Back!
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Log in with your school email
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="example@calpoly.edu" // while calpoly.edu is required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                placeholder=""
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-white absolute right-3 top-1/2 transform -translate-y-1/2"
                style={{ background: "none", border: "none" }}
              >
                {passwordVisible ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </LabelInputContainer>
          <p className="text-center text-sm dark:text-gray-400">
            Forgot your password?
            <Link
              to={"/register/reset-password"}
              className="hover:underline font-bold dark:text-white text-blue-500 ml-3"
            >
              Reset Password
            </Link>
          </p>
          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full my-8 text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            {loading ? "Signing In..." : "Sign In"}
            <BottomGradient />
          </button>
          <div className="flex flex-row text-center w-full my-4 dark:text-gray-400">
            <div className="border-b-2 border-gray-500 mb-2.5 mr-2 w-full"></div>
            <div className="text-sm font-bold w-fit">OR</div>
            <div className="border-b-2 border-gray-500 mb-2.5 ml-2 w-full"></div>
          </div>
          <p className="text-center text-sm dark:text-gray-400">
            Don&apos;t have an account?
            <Link
              to={"/register/sign-up"}
              className="hover:underline font-bold dark:text-white text-blue-500 ml-3"
            >
              Sign up
            </Link>
          </p>
          <div className="w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input dark:bg-zinc-800 ">
            <SpecialButton
              onClick={handleOutlookSignIn}
              text="Login in through Cal Poly Account"
              icon={<IoSchoolSharp />}
              className="w-full"
            />
          </div>
          {registerError ? <ErrorMessage text={registerError} /> : <></>}
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
