import React, { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, authActions } from "@/redux";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { ErrorMessage } from "../../components/register/ErrorMessage";
import { IoSchoolSharp } from "react-icons/io5";
import SpecialButton from "@/components/ui/specialButton";

export function SignupFormDemo() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

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

    // Prepare the user data
    const userData = {
      email,
      password,
      firstName,
      lastName,
    };

    // Dispatch the signup action
    dispatch(authActions.signUpWithEmail({ ...userData, navigate }));
  };

  const handleOutlookSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(authActions.signInWithMicrosoft());
  };

  const renderInitialState = () => (
    <>
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to PolyLink!
      </h2>
      <p
        className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300"
        style={{ marginTop: "15px" }}
      >
        Please log in or create a new account to continue.
      </p>
    </>
  );

  const renderStudentForm = () => (
    <>
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
      <LabelInputContainer>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          placeholder="example@calpoly.edu"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </LabelInputContainer>
      <LabelInputContainer>
        <Label className="mt-4" htmlFor="password">
          Password
        </Label>
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
      <LabelInputContainer>
        <Label className="mt-4" htmlFor="confirmPassword">
          Confirm password
        </Label>
        <Input
          id="confirmPassword"
          placeholder=""
          type={passwordVisible ? "text" : "password"}
          value={confirmedPassword}
          onChange={(e) => setConfirmedPassword(e.target.value)}
        />
      </LabelInputContainer>
    </>
  );

  return (
    <>
      {userLoggedIn && <Navigate to={"/chat"} replace={true} />}
      <div className="max-w-md w-full mx-auto rounded-lg overflow-hidden p-4 space-y-8">
        {renderInitialState()}
        <form onSubmit={handleSubmit}>
          {renderStudentForm()}
          <div className="flex flex-col space-y-4 mt-8">
            <button
              type="submit"
              className="bg-gradient-to-br from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            >
              Sign Up
            </button>
            <p className="text-center text-sm dark:text-gray-400">
              Already have an account?
              <Link
                to={"/register/login"}
                className="hover:underline font-bold dark:text-white text-blue-500 ml-3"
              >
                Log in
              </Link>
            </p>
          </div>
          <div className="w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input dark:bg-zinc-800 ">
            <SpecialButton
              onClick={handleOutlookSignIn}
              text="Login in through Cal Poly Account"
              icon={<IoSchoolSharp />}
              className="w-full"
            />
          </div>
          {registerError && <ErrorMessage text={registerError} />}
        </form>
      </div>
    </>
  );
}

const LabelInputContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col space-y-2">{children}</div>
);

export default SignupFormDemo;
