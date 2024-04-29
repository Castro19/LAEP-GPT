import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { ErrorMessage } from "../../../components/register/ErrorMessage";
import { cn } from "@/lib/utils";
import { IconBrandGoogle } from "@tabler/icons-react";
import {
  doCreateUserWithEmailAndPassword,
  doSignInWithGoogle,
} from "@/firebase/auth";
import { useAuth } from "@/contexts/authContext";
import { Navigate, Link, useNavigate } from "react-router-dom";

export function SignupFormDemo() {
  const { userLoggedIn } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [signUpError, setSignupError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSignupError("");

    // Handling Errors:
    // Validate input fields are not empty
    if (!firstName || !lastName || !email || !password || !confirmedPassword) {
      setSignupError("Please fill in all fields.");
      return;
    }

    // Validate email format
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setSignupError("Invalid email format.");
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setSignupError("Password must be at least 8 characters long.");
      return;
    }

    // Checking if the passwords match
    if (password !== confirmedPassword) {
      setSignupError("Passwords do not match.");
      return;
    }

    try {
    } catch (error) {}
    if (!isRegistering) {
      try {
        setIsRegistering(true);
        await doCreateUserWithEmailAndPassword(
          email,
          password,
          firstName,
          lastName
        );
        setSignupError(""); // Clear error on successful registration
        // Optionally navigate to a different page on successful registration
      } catch (error) {
        console.error(error);
        setIsRegistering(false); // Update registering state upon error

        // Firebase specific error handling
        switch (error.code) {
          case "auth/email-already-in-use":
            setSignupError(
              "The email address is already in use by another account."
            );
            break;
          case "auth/invalid-email":
            setSignupError("The email address is not valid.");
            break;
          case "auth/operation-not-allowed":
            setSignupError("Operation not allowed. Please contact support.");
            break;
          case "auth/weak-password":
            setSignupError(
              "The password is too weak. Please enter a stronger password."
            );
            break;
          default:
            setSignupError("An unexpected error occurred. Please try again.");
            break;
        }
      }
    }
  };

  const handleGoogleSignUp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!isRegistering) {
      setIsRegistering(true);
      await doSignInWithGoogle();
      setIsRegistering(false);
    }
  };

  return (
    <>
      {userLoggedIn && <Navigate to={"/"} replace={true} />}
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Welcome
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Create an account!
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <Label htmlFor="firstname">First name</Label>
              <Input
                id="firstname"
                placeholder="First"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="lastname">Last name</Label>
              <Input
                id="lastname"
                placeholder="Last"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </LabelInputContainer>
          </div>
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
              type="button"
              onClick={togglePasswordVisibility}
              style={{ background: "none", border: "none" }}
            >
              {passwordVisible ? <FiEyeOff /> : <FiEye />}
            </button>
          </LabelInputContainer>

          <LabelInputContainer className="mb-8">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              placeholder=""
              type={passwordVisible ? "text" : "password"}
              value={confirmedPassword}
              onChange={(e) => setConfirmedPassword(e.target.value)}
            />
          </LabelInputContainer>
          {signUpError ? <ErrorMessage text={signUpError} /> : <></>}
          <button
            disabled={isRegistering}
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 mt-8 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            {isRegistering ? "Signing Up..." : "Sign Up"}
            <BottomGradient />
          </button>
          <div
            className="text-center text-sm font-bold 
             dark:text-gray-300 text-blue-500 pt-4"
          >
            Already have an account? {"   "}
            <Link
              to={"/register/login"}
              className="text-center text-sm hover:underline font-bold"
            >
              Continue
            </Link>
          </div>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          <div className="flex flex-col space-y-4">
            <button
              onClick={(e) => handleGoogleSignUp(e)}
              disabled={isRegistering}
              className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
              type="button"
            >
              <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                Sign up with Google
              </span>
              <BottomGradient />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

const BottomGradient = () => {
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
