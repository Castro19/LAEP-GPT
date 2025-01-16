// SignInFlow.tsx
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import TitleCard from "../TitleCard";
import { useAppDispatch, useAppSelector } from "@/redux";
import { setIsNewUser } from "@/redux/auth/authSlice";
import { fetchFlowchartDataHelper } from "@/redux/flowchart/api-flowchart";
import { useUserData } from "@/hooks/useUserData";
import { ScrollArea } from "@/components/ui/scroll-area";
import useIsMobile from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const signInFlowSteps = [
  "terms",
  "input-information",
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
  const [choice, setChoice] = useState<"now" | "later">("now");
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

  useEffect(() => {
    if (
      selections.startingYear &&
      selections.catalog &&
      selections.major &&
      selections.concentration
    ) {
      setIsSkipButton(false);
    }
  }, [flowchartData, selections, navigate]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      position: "absolute",
      width: "100%",
      height: "100%",
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "absolute",
      width: "100%",
      height: "100%",
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      position: "absolute",
      width: "100%",
      height: "100%",
    }),
  };

  const slideTransition = {
    type: "tween",
    duration: 0.3,
    ease: [0.645, 0.045, 0.355, 1.0],
  };

  // Keep track of the swipe direction
  const [[page, direction], setPage] = useState([0, 0]);

  // Update page and direction when navigating
  const handleNext = () => {
    if (currentStep === "terms") {
      setPage([page + 1, 1]); // Moving forward
      navigate("/sign-in-flow/input-information");
    } else if (currentStep === "input-information") {
      if (choice === "now") {
        setPage([page + 1, 1]); // Moving forward
        navigate("/sign-in-flow/basic-information");
      } else {
        if (!isTermsAccepted) {
          toast({
            title: "Terms not accepted",
            description: "Please accept the terms of service to continue",
            variant: "destructive",
          });
          return;
        }
        dispatch(setIsNewUser(false));
        navigate("/chat");
      }
    } else if (currentStepIndex < signInFlowSteps.length - 1) {
      setPage([page + 1, 1]); // Moving forward
      const nextStep = signInFlowSteps[currentStepIndex + 1];
      navigate(`/sign-in-flow/${nextStep}`);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setPage([page - 1, -1]); // Moving backward
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
        className={`flex ${isMobile ? "flex-col" : ""} border border-white 
        ${isMobile ? "w-[95%]" : "w-3/4 h-[80vh]"} bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden`}
      >
        {/* Left Side: Title Card (No Animation) */}
        {!isMobile && (
          <div className="w-1/2 h-full">
            <TitleCard title={title} description={description} />
          </div>
        )}

        {/* Right Side: Animated Content */}
        <div
          className={`${isMobile ? "w-full" : "w-1/2"} h-full flex flex-col justify-between text-black dark:text-white relative overflow-hidden`}
        >
          {isMobile && <TitleCard title={title} description={description} />}

          <ScrollArea className="flex-1 relative">
            <div className="relative" style={{ minHeight: "100%" }}>
              <AnimatePresence initial={false} mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={slideVariants as Variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={slideTransition}
                  className="p-4"
                >
                  <div className="flex flex-col">
                    <Outlet context={{ choice, handleChoice: setChoice }} />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </ScrollArea>

          {/* Navigation Buttons */}
          <div
            className={`flex justify-between p-4 border-t bg-white dark:bg-zinc-800 z-10`}
          >
            {/* Previous Button */}
            <div>
              {currentStepIndex > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrevious}
                  className={`flex items-center px-4 py-2 bg-blue-500 text-white rounded 
                    hover:bg-blue-600 ${isMobile ? "text-sm" : ""}`}
                >
                  <FaArrowLeft className="mr-2" />
                  Back
                </motion.button>
              )}
            </div>

            {/* Next Button */}
            <div>
              {currentStepIndex < signInFlowSteps.length - 1 ? (
                isTermsAccepted ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className={`flex items-center px-4 py-2 bg-blue-500 text-white rounded 
                      hover:bg-blue-600 ${isMobile ? "text-sm" : ""}`}
                  >
                    Next
                    <FaArrowRight className="ml-2" />
                  </motion.button>
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
    </div>
  );
};

export default SignInFlow;
