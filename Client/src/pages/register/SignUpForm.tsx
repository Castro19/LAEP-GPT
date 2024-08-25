import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector, authActions } from "@/redux";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { IconBrandGoogle } from "@tabler/icons-react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { ErrorMessage } from "../../components/register/ErrorMessage";
import { cn } from "@/lib/utils";

export function SignupFormDemo() {
  const [formState, setFormState] = useState("initial");
  const [userType, setUserType] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [about, setAbout] = useState("");
  const [availability, setAvailability] = useState(""); // New field

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
      dispatch(authActions.setSignUpError("Password must be at least 8 characters long."));
      return;
    }
  
    // Checking if the passwords match
    if (password !== confirmedPassword) {
      dispatch(authActions.setSignUpError("Passwords do not match."));
      return;
    }
  
    // Prepare the user data
    const userData = {
      email,
      password,
      firstName,
      lastName,
      userType,
      availability, // Include availability
    };
  
    // Include additional teacher fields if the user is a teacher
    if (userType === "teacher") {
      userData.about = about; // Add the 'about' field for teachers
    }
  
    console.log("User Data passed to signupwithemail thunk: ", userData);
    // Dispatch the signup action
    dispatch(authActions.signUpWithEmail(userData));
  };

  const handleGoogleSignUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(authActions.signInWithGoogle());
  };

  const renderInitialState = () => (
    <>
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to the AI4ESJ Portal!
      </h2>
      <p 
        className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300"
        style={{ marginTop: "15px" }}>
        Please log in or create a new account to continue.
      </p>
      <div className="flex flex-col space-y-4 mt-4">
        <Link to="/login" className="bg-gradient-to-br from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] flex items-center justify-center">
          Log In
        </Link>
        <div className="flex flex-row text-center w-full my-4 dark:text-gray-400">
            <div className="border-b-2 border-gray-500 mb-2.5 mr-4 w-full"></div>
            <div className="text-sm font-bold w-fit">OR</div>
            <div className="border-b-2 border-gray-500 mb-2.5 ml-4 w-full"></div>
          </div>
        <button onClick={() => setFormState("userType")} className="bg-gradient-to-br from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
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
        <button onClick={() => { setUserType("student"); setFormState("student"); }} className="bg-gradient-to-br from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
          Student
        </button>
        <button onClick={() => { setUserType("teacher"); setFormState("teacher"); }} className="bg-gradient-to-br from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
          Teacher
        </button>
      </div>
      <p className="text-center text-sm dark:text-gray-400">
            Already have an account?
            <Link
              to={"/login"}
              className="hover:underline font-bold dark:text-white text-blue-500 ml-3"
            >
              Log in
            </Link>
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
      <LabelInputContainer>
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          placeholder=""
          type={passwordVisible ? "text" : "password"}
          value={confirmedPassword}
          onChange={(e) => setConfirmedPassword(e.target.value)}
        />
      </LabelInputContainer>
      <LabelInputContainer>
        <Label htmlFor="availability">Availability</Label>
        <Input
          id="availability"
          placeholder="I'm available on..."
          type="text"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        />
      </LabelInputContainer>
    </>
  );

  const renderTeacherForm = () => (
    <>
      {renderStudentForm()}
      <LabelInputContainer>
        <Label htmlFor="about">About Yourself</Label>
        <Textarea
          id="about"
          placeholder="Tell us about yourself and your research focus; the more detailed you are, the better we can match you with students."
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          style={{ resize: "none", height: "100px" }}
        />
      </LabelInputContainer>
    </>
  );

  return (
    <>
      {userLoggedIn && <Navigate to={`/${userId}`} replace={true} />}
      <div className="max-w-md w-full mx-auto rounded-lg overflow-hidden p-4 space-y-8">
        {formState === "initial" && renderInitialState()}
        {formState === "userType" && renderUserTypeSelection()}
        {formState === "student" && (
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
                  to={"/login"}
                  className="hover:underline font-bold dark:text-white text-blue-500 ml-3"
                >
                  Log in
                </Link>
              </p>
              {/* LEGACY GOOGLE SIGN UP
              <button
                onClick={handleGoogleSignUp}
                className="bg-gradient-to-br from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] flex items-center justify-center"
              >
                <IconBrandGoogle className="mr-2" /> Sign Up with Google
              </button> */}
            </div>
          </form>
        )}
        {formState === "teacher" && (
          <form onSubmit={handleSubmit}>
            {renderTeacherForm()}
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
                  to={"/login"}
                  className="hover:underline font-bold dark:text-white text-blue-500 ml-3"
                >
                  Log in
                </Link>
              </p>
              {/* LEGACY GOOGLE SIGN UP
              <button
                onClick={handleGoogleSignUp}
                className="bg-gradient-to-br from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] flex items-center justify-center"
              >
                <IconBrandGoogle className="mr-2" /> Sign Up with Google
              </button> */}
            </div>
          </form>
        )}
        {registerError && <ErrorMessage text={registerError} />}
      </div>
    </>
  );
}

const LabelInputContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col space-y-2">{children}</div>
);

export default SignupFormDemo;
