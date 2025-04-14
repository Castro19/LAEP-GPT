// HomePage.tsx
import ResetPasswordForm from "./ResetPasswordForm";
import { EmailVerifiedPage } from "./EmailVerifiedPage";
import SplashLayout from "@/components/layout/splashPage/SplashLayout";

const FirebaseAuth = () => {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");

  let shownComponent = <></>;
  if (mode === "resetPassword") {
    shownComponent = <ResetPasswordForm />;
  } else if (mode === "verifyEmail") {
    shownComponent = <EmailVerifiedPage />;
  }

  return (
    <SplashLayout>
      <div className="flex items-center justify-center min-h-[50vh] my-20">
        {shownComponent}
      </div>
    </SplashLayout>
  );
};

export default FirebaseAuth;
