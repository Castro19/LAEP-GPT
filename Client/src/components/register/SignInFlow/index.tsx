import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, authActions } from "@/redux";
import { useUserData } from "@/hooks/useUserData";
import { toast } from "@/components/ui/use-toast";
import useDeviceType from "@/hooks/useDeviceType";

import MobileSignInFlow from "./MobileSignInFlow";
import DesktopSignInFlow from "./DesktopSignInFlow";

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

  // Or you can keep using isNarrowScreen if you like:
  // const isNarrowScreen = useIsNarrowScreen();

  // The new device hook:
  const deviceType = useDeviceType();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [choice, setChoice] = useState<"now" | "later">("now");

  const location = useLocation();
  const navigate = useNavigate();

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
        setDescription("Personalize your AI assistant now or do this later");
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
        setDescription("This information will be used to match you...");
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

  // Decide which layout to render based on device
  const layoutProps = {
    title,
    description,
    currentStepIndex,
    isTermsAccepted,
    handleNext,
    handlePrevious,
    handleDisableClick,
    handleCompleteProfile,
    signInFlowSteps,
    // If you want to pass down your <Outlet>, you can do something like:
    children: <Outlet context={{ choice, handleChoice: setChoice }} />,
  };

  if (deviceType !== "desktop") {
    return <MobileSignInFlow {...layoutProps} />;
  } else {
    return <DesktopSignInFlow {...layoutProps} />;
  }
};

export default SignInFlow;
