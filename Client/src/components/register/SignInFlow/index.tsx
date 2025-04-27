import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, authActions } from "@/redux";
// Hooks
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";
import { useUserData } from "@/hooks/useUserData";
// Components
import { Button } from "@/components/ui/button";
import TitleCard from "@/components/register/TitleCard";
// Icons & UI Components
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";

const signInFlowSteps = [
  "terms",
  "input-information",
  "basic-information",
  "demographics",
  "interests",
];

const SignInFlow = () => {
  const dispatch = useAppDispatch();
  const { handleSave, userData } = useUserData();
  const isNarrowScreen = useIsNarrowScreen();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [choice, setChoice] = useState<"now" | "later">("now");

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
      case "input-information":
        setTitle("Personalize your profile");
        setDescription(
          "The following questions are optional, but will help us personalize your AI assistant."
        );
        break;
      case "basic-information":
        setTitle("Section 1: Basic Information");
        setDescription("Please select your major and year");
        break;
      case "demographics":
        setTitle("Section 2: Demographics");
        setDescription("Please select your demographic information.");
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

  const handleNext = () => {
    if (currentStep === "terms") {
      navigate("/sign-in-flow/input-information");
    } else if (currentStep === "input-information") {
      if (choice === "now") {
        navigate("/sign-in-flow/basic-information");
      } else {
        dispatch(authActions.setIsNewUser(false));
        navigate("/chat");
      }
    } else if (currentStepIndex < signInFlowSteps.length - 1) {
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
    dispatch(authActions.setIsNewUser(false));
    handleSave();
    navigate("/chat");
  };

  const handleDisableClick = () => {
    toast({
      title: "Terms not accepted",
      description: "Please accept the terms of service to continue",
      variant: "destructive",
    });
  };

  return (
    <>
      {/* Outer container using bg-background to match your splash page */}
      <div className="relative flex items-center justify-center min-h-screen w-full bg-background px-4">
        {/* SVG decorations (dark, subtle) */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none select-none overflow-hidden">
          {/* Slightly visible shape in the top-left */}
          <svg
            className="absolute w-[380px] h-[380px] text-slate-600 opacity-10 top-[-120px] left-[-120px]"
            fill="currentColor"
            viewBox="0 0 512 512"
          >
            <polygon points="0,0 512,0 0,512" />
          </svg>

          {/* Another shape in the bottom-right */}
          <svg
            className="absolute w-[540px] h-[540px] text-slate-700 opacity-10 bottom-[-200px] right-[-180px] rotate-45"
            fill="currentColor"
            viewBox="0 0 512 512"
          >
            <rect width="512" height="512" rx="80" ry="80" />
          </svg>
        </div>

        {/* Main content container */}
        <div
          className={`relative z-10 flex ${isNarrowScreen ? "flex-col h-auto" : ""} border border-slate-500 
          ${isNarrowScreen ? "w-[95%]" : "w-3/4"} ${isNarrowScreen ? "min-h-[80vh]" : "h-[80vh]"} bg-card dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden`}
        >
          {/* Left Side: Title Card */}
          {!isNarrowScreen && (
            <div className="w-1/2 h-full">
              <TitleCard title={title} description={description} />
            </div>
          )}

          {/* Right Side: Content */}
          <div
            className={`${
              isNarrowScreen ? "w-full flex-1" : "w-1/2"
            } h-full flex flex-col justify-between bg-gradient-to-br from-zinc-800/95 via-zinc-800 to-slate-800 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-white`}
          >
            {isNarrowScreen && <TitleCard title={title} description={description} />}

            <ScrollArea className="flex-1 relative p-6">
              <Outlet context={{ choice, handleChoice: setChoice }} />
            </ScrollArea>

            {/* Navigation Buttons */}
            <div className="flex justify-between p-4 border-t border-slate-600/50 bg-gradient-to-br from-zinc-800/95 via-zinc-800 to-slate-800 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
              {/* Previous Button */}
              <div>
                {currentStepIndex > 0 && (
                  <button
                    onClick={handlePrevious}
                    className={`flex items-center px-4 py-2 bg-buttonHover hover:bg-slate-600 text-white rounded-md border border-slate-600/50 transition-all duration-200 ${
                      isNarrowScreen ? "text-sm" : ""
                    }`}
                  >
                    <FaArrowLeft className="mr-2" />
                    Back
                  </button>
                )}
              </div>

              {/* Next or Complete Profile */}
              <div>
                {currentStepIndex < signInFlowSteps.length - 1 ? (
                  isTermsAccepted ? (
                    <button
                      onClick={handleNext}
                      className={`flex items-center px-4 py-2 bg-buttonHover hover:bg-slate-600 text-white rounded-md border border-slate-600/50 transition-all duration-200 ${
                        isNarrowScreen ? "text-sm" : ""
                      }`}
                    >
                      Next
                      <FaArrowRight className="ml-2" />
                    </button>
                  ) : (
                    <Button
                      onClick={handleDisableClick}
                      variant="destructive"
                      className="bg-red-900/80 hover:bg-red-900 text-white border border-red-800/50"
                    >
                      Disabled
                    </Button>
                  )
                ) : isTermsAccepted ? (
                  <button
                    onClick={handleCompleteProfile}
                    className={`px-4 py-2 rounded-md border transition-all duration-200 bg-green-900/80 hover:bg-green-900 border-green-800/50 text-white ${isNarrowScreen ? "text-sm" : ""}`}
                  >
                    Finish
                  </button>
                ) : (
                  <Button
                    onClick={handleDisableClick}
                    variant="destructive"
                    className="bg-red-900/80 hover:bg-red-900 text-white border border-red-800/50"
                  >
                    Disabled
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInFlow;
