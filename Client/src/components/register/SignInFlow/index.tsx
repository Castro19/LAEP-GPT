// SignInFlow.tsx
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import TitleCard from "../TitleCard";
import { useAppDispatch, useAppSelector } from "@/redux";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Using react-icons for arrows
import { useUserData } from "@/hooks/useUserData";
import { setIsNewUser } from "@/redux/auth/authSlice";

const signInFlowSteps = ["about-me", "interests", "availability", "terms"];

const SignInFlow = () => {
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector((state) => state.user);
  const { handleSave } = useUserData();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // Extract the current step from the pathname
  const currentStep = location.pathname.split("/").pop();
  const currentStepIndex = signInFlowSteps.indexOf(currentStep || "");

  useEffect(() => {
    switch (currentStep) {
      case "about-me":
        setTitle(`Welcome, ${userData?.name}!`);
        setDescription("Tell us a little about yourself");
        break;
      case "interests":
        setTitle("What are you interested in?");
        setDescription("Tell us what you're interested in");
        break;
      case "availability":
        setTitle("When are you available?");
        setDescription("Tell us when you're available");
        break;
      case "terms":
        setTitle("Terms of Agreement");
        setDescription("Please read and accept the terms of agreement");
        break;
      default:
        setTitle("Welcome!");
        setDescription("");
    }
  }, [currentStep, userData]);

  // Navigation Handlers
  const handleNext = () => {
    if (currentStepIndex < signInFlowSteps.length - 1) {
      const nextStep = signInFlowSteps[currentStepIndex + 1];
      navigate(`/sign-in-flow/${nextStep}`);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      const prevStep = signInFlowSteps[currentStepIndex - 1];
      navigate(`/sign-in-flow/${prevStep}`);
    }
  };

  const handleCompleteProfile = () => {
    handleSave();
    dispatch(setIsNewUser(false));
    navigate("/"); // Example navigation
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-900">
      <div className="flex w-full max-w-4xl bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden">
        {/* Left Side: Title and Description Component */}
        <TitleCard title={title} description={description} />

        {/* Right Side: Login or Signup Form based on route */}
        <div className="w-1/2 flex flex-col justify-between">
          <div className="flex flex-col justify-center p-8">
            <Outlet />
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-between p-4">
            {/* Previous Arrow */}
            {currentStepIndex > 0 ? (
              <button
                onClick={handlePrevious}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <FaArrowLeft className="mr-2" />
                Back
              </button>
            ) : (
              <div /> // Placeholder to keep spacing
            )}

            {/* Next Arrow or Complete Profile Button */}
            {currentStepIndex < signInFlowSteps.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Next
                <FaArrowRight className="ml-2" />
              </button>
            ) : (
              <button
                onClick={handleCompleteProfile}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Complete Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInFlow;
