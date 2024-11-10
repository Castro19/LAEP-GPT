import React from "react";
import { IoSchoolSharp } from "react-icons/io5";
import { Navigate, useNavigate } from "react-router-dom";
// Importing component

// redux auth:
import { useAppDispatch, useAppSelector, authActions } from "@/redux";
import { ErrorMessage } from "@/components/register/ErrorMessage";

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userLoggedIn, registerError } = useAppSelector((state) => state.auth);

  const handleOutlookSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(authActions.signInWithMicrosoft({ navigate }));
  };

  return (
    <div>
      {userLoggedIn && <Navigate to={`/chat`} replace={true} />}
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input dark:bg-zinc-800 ">
        {registerError ? <ErrorMessage text={registerError} /> : <></>}
        <button
          onClick={handleOutlookSignIn}
          className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-gray-300  dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 dark:hover:bg-slate-700"
        >
          <div className="flex items-center justify-center gap-2">
            <IoSchoolSharp />
            Login in with your Calpoly E-mail
          </div>
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
