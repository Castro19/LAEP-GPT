import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ModeDropDown = ({ isVisible, onSelect, options }) => {
  const navigate = useNavigate();
  // Access the modelType from Redux store
  const modelType = useSelector((state) => state.model.modelType);

  // To manage the dropdown effect of the mode dropdown
  const dropdownRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState("0");

  useEffect(() => {
    if (isVisible) {
      const fullHeight = dropdownRef.current.scrollHeight + "px";
      setMaxHeight(fullHeight);
    } else {
      setMaxHeight("0");
    }
  }, [isVisible]);

  const onViewGPTs = () => {
    navigate("gpts");
  };
  return (
    <div
      ref={dropdownRef}
      className="fixed mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden z-10 transition-max-height duration-500 ease-in-out"
      style={{ maxHeight }}
    >
      {isVisible &&
        options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className="flex justify-between items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-900 hover:text-white"
          >
            {option.label}
            <span
              className={`${
                modelType === option.value
                  ? "bg-blue-500" // Filled circle for selected option
                  : "bg-transparent border border-gray-400" // Empty circle for unselected option
              } inline-block ml-2 rounded-full w-4 h-4`}
            ></span>
          </button>
        ))}
      <button
        onClick={onViewGPTs}
        className="flex justify-between items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-900 hover:text-white"
      >
        View more GPTs
      </button>
    </div>
  );
};

export default ModeDropDown;
