import React, { useEffect } from "react";

const ModeDropDown = ({ isVisible, onSelect, options, modelType }) => {
  if (!isVisible) return null;

  useEffect(() => {
    console.log("MODEL: ", modelType);
  }, [modelType]);
  return (
    <div className="absolute mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden z-10">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-900 hover:text-white"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default ModeDropDown;
