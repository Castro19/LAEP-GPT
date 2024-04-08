import React, { useState } from "react";
import ModeDropDown from "./ModeDropDown";
import Sidebar from "./Sidebar";
import { BiChat } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import NewChat from "./NewChat";
import { useUI } from "./contexts/UIContext";
import { useModel } from "./contexts/ModelContext";
const Header = () => {
  // Define State Vars:
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const { isSidebarVisible, setIsSidebarVisible } = useUI();
  const { setModelType } = useModel();

  // Define Event Handlers for Button on Header being pressed.
  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);
  const toggleDropdown = () => setIsDropdownVisible(!isDropdownVisible);
  const selectMode = (mode) => {
    setModelType(mode);
    setIsDropdownVisible(false);
  };

  // Define the different mode options for out chatBot
  const modeOptions = [
    { label: "normal", value: "normal" },
    { label: "ethical", value: "ethical" },
    { label: "matching", value: "matching" },
  ];

  return (
    <header className="sticky top-0 bg-white dark:bg-gray-800 text-white p-4 z-50 shadow-md">
      <div className="flex items-center justify-between">
        <button onClick={toggleSidebar} className="text-lg">
          <BiChat />
        </button>
        <Sidebar />
        <div>
          <button
            onClick={toggleDropdown}
            className="relative inline-flex items-center text-lg bg-white dark:bg-gray-800"
          >
            LAEP Chatbot
            <span className="ml-4">
              <IoIosArrowDown />
            </span>
          </button>
          {isDropdownVisible && (
            <ModeDropDown
              isVisible={isDropdownVisible}
              onSelect={selectMode}
              options={modeOptions}
            />
          )}
        </div>
        <NewChat />
      </div>
    </header>
  );
};

export default Header;
