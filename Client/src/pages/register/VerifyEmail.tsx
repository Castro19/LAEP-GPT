import { useEffect } from "react";
import { auth } from "@/firebase";
import { sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { setEmailVerifyError } from "@/redux/auth/authSlice.ts";
import { ErrorMessage } from "../../components/register/ErrorMessage";
// redux auth:
import { authActions, useAppDispatch, useAppSelector } from "@/redux";
import { toast } from "@/components/ui/use-toast";
import SpecialButton from "@/components/ui/specialButton";
import SplashLayout from "@/components/layout/splashPage/SplashLayout";
import { environment } from "@/helpers/getEnvironmentVars";

export function VerifyEmail() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { userLoggedIn, userId, registerError, emailVerified } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Redirect to main chat page when email is verified

    if (emailVerified) {
      navigate(`/sign-in-flow`);
    }
  }, [emailVerified, userId, userLoggedIn, navigate]);

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
          if (environment === "dev") {
            console.error("Error sending verification email:", error);
          }

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

  const handleSignOut = async () => {
    // Signs out the user and redirects to the sign up page
    if (auth.currentUser) {
      dispatch(authActions.signOutUser());
    }
    navigate("/register/login");
  };

  return (
    <SplashLayout>
      <div className="min-h-[50vh] my-20 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input dark:bg-zinc-800">
          <h2 className="text-center font-bold text-xl text-neutral-800 dark:text-neutral-200">
            Please Verify Your Email
          </h2>
          <p className="text-center text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
            You need to verify your email address before continuing. Please
            refresh this page after verifying your email.
          </p>

          <SpecialButton
            onClick={handleSendVerificationEmail}
            text="Resend Verification Email"
            className="mt-4"
          />

          {registerError ? <ErrorMessage text={registerError} /> : <></>}

          <div className="flex flex-row text-center w-full my-4 dark:text-gray-400">
            <div className="border-b-2 border-gray-500 mb-2.5 mr-2 w-full"></div>
            <div className="text-sm font-bold w-fit">OR</div>
            <div className="border-b-2 border-gray-500 mb-2.5 ml-2 w-full"></div>
          </div>

          <p className="text-center text-sm dark:text-gray-400">
            <button
              onClick={handleSignOut} // Use the function here
              className="hover:underline font-bold dark:text-white text-blue-500 mr-2"
            >
              Sign in
            </button>
            with a different account.
          </p>
        </div>
      </div>
    </SplashLayout>
  );
}

export const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};
