import React, { useState } from "react";
import ModeDropDown from "./ModeDropDown";

const Header = ({ modelType, setModelType }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const toggleDropdown = () => setIsDropdownVisible(!isDropdownVisible);

  const selectMode = (mode) => {
    setModelType(mode);
    setIsDropdownVisible(false);
  };
  const modeOptions = [
    { label: "normal", value: "normal" },
    { label: "ethical", value: "ethical" },
    { label: "matching", value: "matching" },
  ];

  return (
    <header className="sticky top-0 bg-white dark:bg-gray-800 text-black p-4 z-50 shadow-md">
      <div className="flex items-center justify-between">
        <button className="text-lg">...</button>
        <div>
          <button
            onClick={toggleDropdown}
            className="relative inline-flex items-center text-lg bg-white dark:bg-gray-800"
          >
            LAEP Chatbot
            <svg
              className="ml-2 -mr-1 w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          {isDropdownVisible && (
            <ModeDropDown
              isVisible={isDropdownVisible}
              onSelect={selectMode}
              options={modeOptions}
              modelType={modelType}
            />
          )}
        </div>
        <button className="text-lg">++</button>
      </div>
    </header>
  );
};

export default Header;
