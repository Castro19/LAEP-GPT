import React, { useEffect, useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, authActions } from "@/redux";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { ErrorMessage } from "../../components/register/ErrorMessage";
import { IoSchoolSharp } from "react-icons/io5";
import SpecialButton from "@/components/ui/specialButton";
import { clearRegisterError } from "@/redux/auth/authSlice";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Helmet } from "react-helmet-async";

export function SignupFormDemo() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isIncoming, setIsIncoming] = useState(false);
  const [secretPassphrase, setSecretPassphrase] = useState("");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userLoggedIn, registerError } = useAppSelector((state) => state.auth);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate input fields are not empty
    if (!firstName || !lastName || !email || !password || !confirmedPassword) {
      dispatch(authActions.setRegisterError("Please fill in all fields."));
      return;
    }

    // Validate email format
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      dispatch(authActions.setRegisterError("Invalid email format."));
      return;
    }

    // Validate password length
    if (password.length < 8) {
      dispatch(
        authActions.setRegisterError(
          "Password must be at least 8 characters long."
        )
      );
      return;
    }

    // Checking if the passwords match
    if (password !== confirmedPassword) {
      dispatch(authActions.setRegisterError("Passwords do not match."));
      return;
    }

    // Validate passphrase if isIncoming is true
    if (isIncoming && !secretPassphrase) {
      dispatch(
        authActions.setRegisterError(
          "Please enter the passphrase for incoming students."
        )
      );
      return;
    }

    // Prepare the user data
    const userData = {
      email,
      password,
      firstName,
      lastName,
      isIncoming,
      secretPassphrase: isIncoming ? secretPassphrase : undefined,
    };

    // Dispatch the signup action
    dispatch(authActions.signUpWithEmail({ ...userData, navigate }));
  };

  const handleOutlookSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(authActions.signInWithMicrosoft());
  };

  useEffect(() => {
    dispatch(clearRegisterError());
  }, [dispatch]);

  return (
    <div>
      <Helmet>
        <title>Sign Up | PolyLink</title>
        <meta
          name="description"
          content="Create your PolyLink account to access AI-powered course planning tools, schedule builder, and connect with your Cal Poly community."
        />

        {/* OpenGraph Image Tags */}
        <meta property="og:title" content="Sign Up | PolyLink" />
        <meta
          property="og:image"
          content="https://polylink.dev/seo-signup.png"
        />
        <meta
          property="og:description"
          content="Create your PolyLink account to access AI-powered course planning tools, schedule builder, and connect with your Cal Poly community."
        />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://polylink.dev/seo-signup.png"
        />
        <meta name="twitter:title" content="Sign Up | PolyLink" />
        <meta
          name="twitter:description"
          content="Create your PolyLink account to access AI-powered course planning tools, schedule builder, and connect with your Cal Poly community."
        />
      </Helmet>
      {userLoggedIn && <Navigate to={"/chat"} replace={true} />}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full mx-auto"
      >
        <h2 className="font-bold text-2xl text-neutral-200 mb-2">
          Welcome to PolyLink!
        </h2>
        <p className="text-neutral-400 text-sm max-w-sm mb-8">
          Please create a new account to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <LabelInputContainer className="flex-1">
              <Label htmlFor="firstname" className="text-neutral-200">
                First name
              </Label>
              <Input
                id="firstname"
                placeholder="First"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-neutral-800/50 border-neutral-700 text-neutral-200 placeholder:text-neutral-500 focus:border-blue-500"
              />
            </LabelInputContainer>
            <LabelInputContainer className="flex-1">
              <Label htmlFor="lastname" className="text-neutral-200">
                Last name
              </Label>
              <Input
                id="lastname"
                placeholder="Last"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-neutral-800/50 border-neutral-700 text-neutral-200 placeholder:text-neutral-500 focus:border-blue-500"
              />
            </LabelInputContainer>
          </div>

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
                placeholder="Create a password"
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

          <LabelInputContainer>
            <Label htmlFor="confirmPassword" className="text-neutral-200">
              Confirm password
            </Label>
            <Input
              id="confirmPassword"
              placeholder="Confirm your password"
              type={passwordVisible ? "text" : "password"}
              value={confirmedPassword}
              onChange={(e) => setConfirmedPassword(e.target.value)}
              className="bg-neutral-800/50 border-neutral-700 text-neutral-200 placeholder:text-neutral-500 focus:border-blue-500"
            />
          </LabelInputContainer>

          {/* Incoming Student Toggle */}
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="incoming-student" className="text-neutral-200">
              I am an incoming student
            </Label>
            <Switch
              id="incoming-student"
              checked={isIncoming}
              onCheckedChange={setIsIncoming}
            />
          </div>

          {/* Passphrase Input - Only shown when isIncoming is true */}
          {isIncoming && (
            <LabelInputContainer>
              <Label htmlFor="passphrase" className="text-neutral-200">
                Passphrase
              </Label>
              <Input
                id="passphrase"
                placeholder="Enter the passphrase for incoming students"
                type="text"
                value={secretPassphrase}
                onChange={(e) => setSecretPassphrase(e.target.value)}
                className="bg-neutral-800/50 border-neutral-700 text-neutral-200 placeholder:text-neutral-500 focus:border-blue-500"
              />
            </LabelInputContainer>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg py-2.5 font-medium shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
          >
            Sign Up
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
            text="Sign up with Cal Poly Account"
            icon={<IoSchoolSharp className="text-xl" />}
            className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700"
          />

          <div className="text-center">
            <p className="text-neutral-400 text-sm">
              Already have an account?{" "}
              <Link
                to={"/register/login"}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>
          {/* Disclaimer: Do not use the same password for multiple accounts and do not use the same passwword for PolyLink as your Cal Poly account */}
          <div className="flex justify-center text-neutral-500 text-sm">
            Do not use the same password for PolyLink as your Cal Poly account.
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

export default SignupFormDemo;
