import React, { useState } from "react";
import { cn } from "@/lib/utils";
// Importing component
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
// redux auth:
import { useAppDispatch } from "@/redux";
// Helper Components

import SpecialButton from "@/components/ui/specialButton";
import { resetPassword } from "@/redux/auth/authSlice";
import { toast } from "@/components/ui/use-toast";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useAppDispatch();

  const handleResetPassword = (email: string) => {
    console.log("Resetting password for", email);
    dispatch(resetPassword({ email, dispatch }));
    toast({
      title: "Password reset email sent",
      description: "Check your email for a link to reset your password.",
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleResetPassword(email);
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input dark:bg-zinc-800">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome Back!
      </h2>
      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="example@calpoly.edu" // while calpoly.edu is required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </LabelInputContainer>
        <div className="w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input dark:bg-zinc-800 ">
          <SpecialButton
            type="submit"
            onClick={() => handleResetPassword(email)}
            text="Reset Password"
            icon={<></>}
            className="w-full"
            disabled={!email}
          />
        </div>
      </form>
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

export default ResetPassword;
