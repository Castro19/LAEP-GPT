import React from "react";
import { MdEdit } from "react-icons/md";
import { ButtonProps } from "./button";

interface SpecialButtonProps {
  onClick: () => void;
  text: string;
  icon?: React.ReactNode;
  props?: ButtonProps;
}

const SpecialButton: React.FC<SpecialButtonProps & ButtonProps> = ({
  onClick,
  text,
  icon = <MdEdit />,
  ...props
}) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <button
        onClick={onClick}
        className={`w-3/4 p-2 border rounded-lg bg-gray-100 dark:bg-indigo-800 dark:text-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 dark:hover:bg-indigo-700 ${props.className}`}
      >
        <div className="flex items-center justify-center gap-2">
          {text}
          {icon}
        </div>
      </button>
    </div>
  );
};

export default SpecialButton;
