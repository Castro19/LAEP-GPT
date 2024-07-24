import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
// Redux
import { useAppDispatch, useAppSelector, authActions } from "@/redux";
// Icons
import { FiEye, FiEyeOff } from "react-icons/fi";
import { IconBrandGoogle } from "@tabler/icons-react";
// Importing component
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { ErrorMessage } from "../../components/register/ErrorMessage";
import { cn } from "@/lib/utils";

export function SignupFormDemo() {
  const [formState, setFormState] = useState("initial"); // 'initial', 'userType', 'student', 'teacher'
  const [userType, setUserType] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Additional teacher fields
  const [school, setSchool] = useState("");
  const [subject, setSubject] = useState("");

  const dispatch = useAppDispatch();
  const { userLoggedIn, userId, registerError, loading } = useAppSelector(
    (state) => state.auth
  );

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate input fields are not empty
    if (!firstName || !lastName || !email || !password || !confirmedPassword) {
      dispatch(authActions.setSignUpError("Please fill in all fields."));
      return;
    }

    // Validate email format
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      dispatch(authActions.setSignUpError("Invalid email format."));
      return;
    }

    // Validate password length
    if (password.length < 8) {
      dispatch(
        authActions.setSignUpError(
          "Password must be at least 8 characters long."
        )
      );
      return;
    }

    // Checking if the passwords match
    if (password !== confirmedPassword) {
      dispatch(authActions.setSignUpError("Passwords do not match."));
      return;
    }

    // Different dispatch based on user type
    if (userType === "student") {
      dispatch(
        authActions.signUpWithEmail({ email, password, firstName, lastName, userType })
      );
    } else if (userType === "teacher") {
      dispatch(
        authActions.signUpWithEmail({ email, password, firstName, lastName, userType})
      );
    }
  };

  const handleGoogleSignUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(authActions.signInWithGoogle());
  };

  const renderInitialState = () => (
    <>
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Log in or create an account
      </p>
      <div className="flex flex-col space-y-4 mt-4">
        <Link to="/login" className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] flex items-center justify-center">
          Log In
        </Link>
        <button onClick={() => setFormState("userType")} className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
          Create Account
        </button>
      </div>
    </>
  );

  const renderUserTypeSelection = () => (
    <>
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        I am a...
      </h2>
      <div className="flex flex-col space-y-4 mt-4">
        <button onClick={() => { setUserType("student"); setFormState("student"); }} className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
          Student
        </button>
        <button onClick={() => { setUserType("teacher"); setFormState("teacher"); }} className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
          Teacher
        </button>
      </div>
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
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            style={{ background: "none", border: "none" }}
          >
            {passwordVisible ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
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
    </>
  );

  const renderTeacherForm = () => (
    <>
      {renderStudentForm()}
      <LabelInputContainer className="mb-4">
        <Label htmlFor="school">School</Label>
        <Input
          id="school"
          placeholder="Your school"
          type="text"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
        />
      </LabelInputContainer>
      <LabelInputContainer className="mb-4">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          placeholder="Your subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </LabelInputContainer>
    </>
  );

  return (
    <>
      {userLoggedIn && <Navigate to={`/${userId}`} replace={true} />}
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        {formState === "initial" && renderInitialState()}
        {formState === "userType" && renderUserTypeSelection()}
        {(formState === "student" || formState === "teacher") && (
          <form className="my-8" onSubmit={handleSubmit}>
            <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 mb-4">
              Create an account
            </h2>
            {formState === "student" ? renderStudentForm() : renderTeacherForm()}
            {registerError && <ErrorMessage text={registerError} />}
            <button
              disabled={loading}
              className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 mt-8 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
            >
              {loading ? "Signing Up..." : "Sign Up"}
              <BottomGradient />
            </button>
            <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
            <div className="flex flex-col space-y-4">
              <button
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
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
        )}
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