import React, { useState } from "react";
import ModeDropDown from "../customGPT/ModeDropDown";
import Sidebar from "./Sidebar";
import { BiChat } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import NewChat from "../chat/NewChat";
// import { useUI } from "../contexts/UIContext";

// Redux:
import { useSelector, useDispatch } from "react-redux";
import { setCurrentGpt } from "../../redux/gpt/gptSlice";

import { toggleSidebar as toggleReduxSidebar } from "../../redux/layout/layoutSlice";

const ChatHeader = () => {
  // Define State Vars:handleModeSelection
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // Redux:
  const dispatch = useDispatch();
  const isSidebarVisible = useSelector(
    (state) => state.layout.isSidebarVisible
  );

  // Define Event Handlers for Button on Header being pressed.
  const toggleSidebar = () => dispatch(toggleReduxSidebar(!isSidebarVisible));
  const toggleDropdown = () => setIsDropdownVisible(!isDropdownVisible);

  const handleModeSelection = (modelId) => {
    console.log(modelId);
    dispatch(setCurrentGpt(modelId));

    setIsDropdownVisible(false);
  };

  return (
    <header className="sticky top-0 bg-white dark:bg-gray-800 text-white p-4 z-50 border-b-2 border-gray-300 dark:border-x-gray-500 shadow-md">
      {" "}
      <div className="flex items-center justify-between">
        <button onClick={toggleSidebar} className="text-lg hover:text-gray-300">
          <BiChat />
        </button>
        <Sidebar />
        <div>
          <button
            onClick={toggleDropdown}
            className="relative inline-flex items-center text-lg bg-white dark:bg-gray-800 hover:text-gray-300"
          >
            LAEP Chatbot
            <span className="ml-4">
              <IoIosArrowDown />
            </span>
          </button>
          {isDropdownVisible && (
            <ModeDropDown
              isVisible={isDropdownVisible}
              onSelect={handleModeSelection}
            />
          )}
        </div>
        <NewChat />
      </div>
    </header>
  );
};

export default ChatHeader;
