import React from "react";
import { IconBrandOffice } from "@tabler/icons-react";
import { Navigate, useNavigate } from "react-router-dom";
// Importing component

// redux auth:
import { useAppDispatch, useAppSelector, authActions } from "@/redux";
import { ErrorMessage } from "@/components/register/ErrorMessage";

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userLoggedIn, registerError, userId } = useAppSelector(
    (state) => state.auth
  );

  const handleOutlookSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(authActions.signInWithMicrosoft({ navigate }));
  };

  return (
    <div>
      {userLoggedIn && <Navigate to={`/user/${userId}`} replace={true} />}
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input dark:bg-zinc-800">
        {registerError ? <ErrorMessage text={registerError} /> : <></>}

        <button
          onClick={handleOutlookSignIn}
          className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
          type="button"
        >
          <IconBrandOffice className="w-4 text-neutral-800 dark:text-neutral-300" />
          <span className="text-neutral-700 dark:text-neutral-300 text-sm">
            Login in with Outlook
          </span>
          <BottomGradient />
        </button>
      </div>
    </div>
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
