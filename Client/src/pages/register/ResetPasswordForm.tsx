import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
// Importing component
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
// redux auth:
import { authActions, useAppDispatch, useAppSelector } from "@/redux";
// Helper Components

import SpecialButton from "@/components/ui/specialButton";
// import { resetPassword } from "@/redux/auth/authSlice";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useNavigate } from "react-router-dom";
import { ErrorMessage } from "@/components/register/ErrorMessage";

const ResetPasswordForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { resetPasswordError } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oobCode = params.get("oobCode");
    if (oobCode) {
      dispatch(authActions.verifyResetCode({ oobCode }));
      toast({
        title: "Password successfully reset",
        description: "You can now login with your new password",
        action: (
          <ToastAction
            altText="Login"
            onClick={() => navigate("/register/login")}
          >
            Login
          </ToastAction>
        ),
      });
    } else {
      // Handle missing oobCode scenario
      toast({
        variant: "destructive",
        title: "No oobCode found",
        description: "Please try again",
      });
    }
  }, [dispatch, navigate]);

  // On form submission (where user enters new password):
  const handleResetPassword = (password: string) => {
    const params = new URLSearchParams(window.location.search);
    const oobCode = params.get("oobCode");
    if (!oobCode) {
      console.error("No oobCode found in the URL");
      return;
    }

    dispatch(
      authActions.confirmNewPassword({ oobCode, newPassword: password })
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate password length
    if (password.length < 8) {
      console.log("Password must be at least 8 characters long.");
      dispatch(
        authActions.setResetPasswordError(
          "Password must be at least 8 characters long."
        )
      );
      return;
    }

    // Checking if the passwords match
    if (password !== confirmedPassword) {
      console.log("Passwords do not match.");
      dispatch(authActions.setResetPasswordError("Passwords do not match."));
      return;
    }

    handleResetPassword(password);
    dispatch(authActions.clearResetPasswordError());
    toast({
      title: "Password successfully reset",
      description: "You can now login with your new password",
    });
    navigate("/register/login");
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input dark:bg-zinc-800">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Reset password
      </h2>
      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer>
          <Label className="mt-4" htmlFor="password">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              placeholder=""
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-white absolute right-3 top-1/2 transform -translate-y-1/2"
              style={{ background: "none", border: "none" }}
            >
              {passwordVisible ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </LabelInputContainer>
        <LabelInputContainer>
          <Label className="mt-4" htmlFor="confirmPassword">
            Confirm password
          </Label>
          <Input
            id="confirmPassword"
            placeholder=""
            type={passwordVisible ? "text" : "password"}
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
          />
        </LabelInputContainer>
        <div className="w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input dark:bg-zinc-800 ">
          <SpecialButton
            type="submit"
            onClick={() => handleResetPassword(password)}
            text="Reset Password"
            icon={<></>}
            className="w-full"
            disabled={!password}
          />
        </div>
      </form>
      {resetPasswordError && <ErrorMessage text={resetPasswordError} />}
    </div>
  );
};

export const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default ResetPasswordForm;
