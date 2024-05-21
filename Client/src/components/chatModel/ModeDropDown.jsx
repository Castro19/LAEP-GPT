import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
// UI
import UserAvatar from "@/components/userProfile/UserAvatar";
const ModeDropDown = ({ isVisible, onSelect }) => {
  const navigate = useNavigate();
  // Access the modelType from Redux store
  const currentModel = useSelector((state) => state.gpt.currentModel);
  const gptList = useSelector((state) => state.gpt.gptList);

  // To manage the dropdown effect of the mode dropdown
  const dropdownRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState("0");
  console.log("GPTLIST: ", gptList);
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
        gptList.map((option) => (
          <div
            key={option.id}
            className="flex items-center pr-4 py-2 hover:bg-gray-300 hover:text-white"
          >
            <UserAvatar userPhoto={option.urlPhoto} />
            <button
              onClick={() => onSelect(option.id)}
              className="flex justify-between items-center w-full ml-2 text-left text-sm text-gray-700"
            >
              {option.title}
              <span
                className={`${
                  currentModel.id === option.id
                    ? "bg-blue-500" // Filled circle for selected option
                    : "bg-transparent border border-gray-400" // Empty circle for unselected option
                } inline-block ml-2 rounded-full w-4 h-4`}
              ></span>
            </button>
          </div>
        ))}
      <button
        onClick={onViewGPTs}
        className="flex justify-between items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-900 hover:text-white"
      >
        View more Assistants
      </button>
    </div>
  );
};

export default ModeDropDown;
