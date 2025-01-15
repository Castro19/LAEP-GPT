// SignInFlow.tsx
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import TitleCard from "../TitleCard";
import { useAppDispatch, useAppSelector } from "@/redux";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Using react-icons for arrows
import { setIsNewUser } from "@/redux/auth/authSlice";
import { fetchFlowchartDataHelper } from "@/redux/flowchart/api-flowchart";
import { useUserData } from "@/hooks/useUserData";
import { ScrollArea } from "@/components/ui/scroll-area";
import useIsMobile from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const signInFlowSteps = [
  "terms",
  "basic-information",
  "demographics",
  "interests",
  "flowchart",
];

const SignInFlow = () => {
  const dispatch = useAppDispatch();
  const { handleSave, userData } = useUserData();
  const isMobile = useIsMobile();
  const { selections } = useAppSelector((state) => state.flowSelection);
  const { flowchartData } = useAppSelector((state) => state.flowchart);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isSkipButton, setIsSkipButton] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the current step from the pathname
  const currentStep = location.pathname.split("/").pop();
  const currentStepIndex = signInFlowSteps.indexOf(currentStep || "");

  useEffect(() => {
    switch (currentStep) {
      case "terms":
        setTitle("Terms of Service");
        setDescription("Please read and accept the terms of agreement");
        setIsTermsAccepted(userData?.canShareData || false);
        break;
      case "basic-information":
        setTitle("Section 1: Basic Information");
        setDescription("Please select your major and year");
        break;
      case "demographics":
        setTitle("Section 2: Demographics");
        setDescription(
          "Please select your demographic information (optional)."
        );
        break;
      case "interests":
        setTitle("Section 3: Personal Insights");
        setDescription(
          `This information will be used to match you with clubs, events, and more!`
        );
        break;
      case "flowchart":
        setTitle("Section 4: Flowchart");
        setDescription(
          "Generate a flowchart by inputting the following information"
        );
        break;
      default:
        setTitle("Welcome!");
        setDescription("");
        navigate("/sign-in-flow/terms");
    }
  }, [currentStep, userData, navigate]);

  useEffect(() => {
    if (selections.catalog && selections.major && selections.concentration) {
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
    if (!isTermsAccepted) {
      toast({
        title: "Terms not accepted",
        description: "Please accept the terms of service to continue",
        variant: "destructive",
      });
      return;
    }
    dispatch(setIsNewUser(false));
    handleSave();
    if (selections.catalog && selections.major && selections.concentration) {
      fetchFlowchartDataHelper(
        dispatch,
        selections.catalog,
        selections.major,
        selections.concentration.code
      );
      navigate("/flowchart");
    } else {
      navigate("/chat");
    }
  };

  const handleDisableClick = () => {
    toast({
      title: "Terms not accepted",
      description: "Please accept the terms of service to continue",
      variant: "destructive",
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-800">
      <div
        className={`flex ${isMobile ? "flex-col" : ""} border border-white ${isMobile ? "w-[95%]" : "w-3/4"} bg-white dark:bg-zinc-800 rounded-lg shadow-lg`}
      >
        {/* Left Side: Title and Description Component */}
        {!isMobile && <TitleCard title={title} description={description} />}

        {/* Right Side: Sign up flow form based on route */}
        <div
          className={`${isMobile ? "w-full" : "w-1/2 min-h-[50vh] max-h-[80vh]"} flex flex-col justify-between text-black dark:text-white`}
        >
          {isMobile && <TitleCard title={title} description={description} />}
          <ScrollArea className={`overflow-y-auto`}>
            <div className={"flex flex-col justify-between h-full p-4"}>
              <div className="flex flex-col flex-1 min-h-0">
                <Outlet />
              </div>
            </div>
          </ScrollArea>
          {/* Navigation Arrows */}
          <div className={`flex justify-between ${isMobile ? "p-2" : "p-4"}`}>
            {/* Previous Arrow */}
            {currentStepIndex > 0 ? (
              <button
                onClick={handlePrevious}
                className={`flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${isMobile ? "text-sm" : ""}`}
              >
                <FaArrowLeft className="mr-2" />
                Back
              </button>
            ) : (
              <div /> // Placeholder to keep spacing
            )}

            {/* Next Arrow or Complete Profile Button */}
            {currentStepIndex < signInFlowSteps.length - 1 ? (
              isTermsAccepted ? (
                <button
                  onClick={handleNext}
                  className={`flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${isMobile ? "text-sm" : ""}`}
                >
                  Next
                  <FaArrowRight className="ml-2" />
                </button>
              ) : (
                <Button onClick={handleDisableClick} variant="destructive">
                  Disabled
                </Button>
              )
            ) : isTermsAccepted ? (
              <button
                onClick={handleCompleteProfile}
                className={`px-4 py-2 ${isSkipButton ? "bg-gray-500 hover:bg-gray-600" : "bg-green-500 hover:bg-green-600"} text-white rounded ${isMobile ? "text-sm" : ""}`}
              >
                {isSkipButton ? "Skip" : "Create Flowchart"}
              </button>
            ) : (
              <Button onClick={handleDisableClick} variant="destructive">
                Disabled
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInFlow;
