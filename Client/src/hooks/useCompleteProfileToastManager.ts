import { useEffect } from "react";
import useCompleteProfileToast from "@/components/register/CompleteProfileToast";

const useCompleteProfileToastManager = () => {
  const showCompleteProfileToast = useCompleteProfileToast();

  useEffect(() => {
    const showToast =
      localStorage.getItem("showCompleteProfileToast") !== "false";
    if (showToast) {
      showCompleteProfileToast();
    }
  }, [showCompleteProfileToast]);

  const disableToast = () => {
    localStorage.setItem("showCompleteProfileToast", "false");
  };

  return { disableToast };
};

export default useCompleteProfileToastManager;
