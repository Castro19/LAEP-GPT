import React from "react";
import { MdEdit } from "react-icons/md";

interface SpecialButtonProps {
  onClick: () => void;
  text: string;
}

const SpecialButton: React.FC<SpecialButtonProps> = ({ onClick, text }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <button
        onClick={onClick}
        className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-indigo-800 dark:text-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 dark:hover:bg-indigo-700"
      >
        <div className="flex items-center justify-center gap-2">
          {text}
          <MdEdit />
        </div>
      </button>
    </div>
  );
};

export default SpecialButton;
