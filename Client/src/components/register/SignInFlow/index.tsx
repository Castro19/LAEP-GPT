// SignInFlow.tsx
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import TitleCard from "../TitleCard";
import { useAppDispatch, useAppSelector } from "@/redux";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Using react-icons for arrows
import { setIsNewUser } from "@/redux/auth/authSlice";
import { fetchFlowchartDataHelper } from "@/redux/flowchart/api-flowchart";

const signInFlowSteps = [
  "terms",
  "about-me",
  "interests",
  "availability",
  "flowchart",
];

const SignInFlow = () => {
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector((state) => state.user);
  const { flowchartData, selections } = useAppSelector(
    (state) => state.flowchart
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSkipButton, setIsSkipButton] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the current step from the pathname
  const currentStep = location.pathname.split("/").pop();
  const currentStepIndex = signInFlowSteps.indexOf(currentStep || "");

  useEffect(() => {
    switch (currentStep) {
      case "terms":
        setTitle("Terms of Agreement");
        setDescription("Please read and accept the terms of agreement");
        break;
      case "about-me":
        setTitle(`Welcome, ${userData?.name}!`);
        setDescription("Tell us a little about yourself");
        break;
      case "interests":
        setTitle("What are you interested in?");
        setDescription("Tell us what you're interested in");
        break;
      case "courses":
        setTitle("What courses have you taken?");
        setDescription("Tell us what courses you've taken");
        break;
      case "availability":
        setTitle("When are you available?");
        setDescription("Tell us when you're available");
        break;
      case "flowchart":
        setTitle("Setup your flowchart");
        setDescription("Input the following information");
        break;
      default:
        setTitle("Welcome!");
        setDescription("");
    }
  }, [currentStep, userData]);

  useEffect(() => {
    if (flowchartData) {
      console.log("flowchartData", flowchartData);
      navigate("/flowchart");
    } else if (
      selections.catalog &&
      selections.major &&
      selections.concentration
    ) {
      setIsSkipButton(false);
    }
  }, [flowchartData, selections, navigate]);

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
    if (selections.catalog && selections.major && selections.concentration) {
      fetchFlowchartDataHelper(
        dispatch,
        selections.catalog,
        selections.major,
        selections.concentration
      );
    } else {
      navigate("/chat");
      dispatch(setIsNewUser(false));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-800">
      <div className="flex border border-white h-3/4 w-3/4 bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden">
        {/* Left Side: Title and Description Component */}
        <TitleCard title={title} description={description} />

        {/* Right Side: Login or Signup Form based on route */}
        <div className="w-1/2 flex flex-col justify-between text-black dark:text-white">
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
                className={`px-4 py-2 ${isSkipButton ? "bg-gray-500 hover:bg-gray-600" : "bg-green-500 hover:bg-green-600"} text-white rounded `}
              >
                {isSkipButton ? "Skip" : "Create Flowchart"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInFlow;
