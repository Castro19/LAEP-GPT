import { useEffect, useRef, useState } from "react";
import SpecialButton from "@/components/ui/specialButton";
import { authActions, useAppDispatch, useAppSelector } from "@/redux";
import { useNavigate } from "react-router-dom";
import { getAuth, applyActionCode, sendEmailVerification } from "firebase/auth";
import { useUserData } from "@/hooks/useUserData";
import { toast } from "@/components/ui/use-toast";
import { auth } from "@/firebase";
import { setEmailVerifyError } from "@/redux/auth/authSlice";

export function EmailVerifiedPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const verificationAttempted = useRef(false);

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const { emailVerified, isNewUser } = useAppSelector((state) => state.auth);
  const { handleSave, handleChange } = useUserData();

  const handleSendVerificationEmail = async () => {
    // Resends verification email to user upon request
    if (auth.currentUser) {
      sendEmailVerification(auth.currentUser)
        .then(() => {
          toast({
            title: "Email Resent",
            description:
              "Your verification email has been resent! Please check your spam folder if you do not see it in your inbox.",
          });
        })
        .catch((error) => {
          console.error("Error sending verification email:", error);

          if (error.code === "auth/too-many-requests") {
            dispatch(
              setEmailVerifyError(
                "Too many requests. Please wait a while before trying again."
              )
            );
          } else {
            dispatch(
              setEmailVerifyError(
                "Failed to send verification email. Please try again later."
              )
            );
          }
        });
    }
  };

  useEffect(() => {
    if (verificationAttempted.current) return;
    verificationAttempted.current = true;

    const auth = getAuth();
    const params = new URLSearchParams(window.location.search);
    const oobCode = params.get("oobCode");

    if (!oobCode) {
      setStatus("error");
      return;
    }

    if (!isNewUser) {
      dispatch(authActions.setIsNewUser(true));
    }

    applyActionCode(auth, oobCode)
      .then(() => {
        console.log("Email verified");
        handleChange("emailVerified", true);
        handleSave();
        // Email is verified
        setStatus("success");
      })
      .catch((error) => {
        if (emailVerified) {
          setStatus("success");
        } else {
          console.error("Error verifying email:", error);
          setStatus("error");
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, navigate]);

  if (status === "verifying") {
    return (
      <div className="max-w-md w-full mx-auto p-8 shadow-input dark:bg-zinc-800">
        <p className="text-center text-neutral-600 dark:text-neutral-400">
          Verifying your email, please wait...
        </p>
      </div>
    );
  }

  if (status === "error" && !emailVerified) {
    return (
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input dark:bg-zinc-800">
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-3">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M9 19h6m-3-3v-3M3 3h18M3 21h18"
              />
            </svg>
          </div>
          <h2 className="font-bold text-2xl text-center text-neutral-800 dark:text-neutral-200">
            Email Verification Failed
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-center">
            We couldn&apos;t verify your email. The link may be invalid or
            expired. Please try requesting a new verification email.
          </p>
        </div>
        <SpecialButton
          text="Resend Verification Email"
          onClick={handleSendVerificationEmail}
          className="mt-4"
        />
      </div>
    );
  }

  // If we reach here, status === "success"
  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input dark:bg-zinc-800">
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-3">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="font-bold text-2xl text-center text-neutral-800 dark:text-neutral-200">
          Email has been Verified Successfully!
        </h2>

        <p className="text-neutral-600 dark:text-neutral-400 text-center">
          Your account has been verified. You can now log in and start using our
          services.
        </p>

        <SpecialButton
          text="Continue to Login"
          onClick={() => navigate("/register/login")}
          className="w-full mt-6"
        />
      </div>
    </div>
  );
}
