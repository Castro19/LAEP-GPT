// HomePage.tsx
import ResetPasswordForm from "./ResetPasswordForm";
import { EmailVerifiedPage } from "./EmailVerifiedPage";

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
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 ">
      {shownComponent}
    </div>
  );
};

export default FirebaseAuth;
