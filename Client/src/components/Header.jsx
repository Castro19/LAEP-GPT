import React, { useState } from "react";
import ModeDropDown from "./ModeDropDown";
import Sidebar from "./Sidebar";
import { BiChat } from "react-icons/bi";
import { RiChatNewFill } from "react-icons/ri";
import { IoIosArrowDown } from "react-icons/io";

const Header = ({
  msgList,
  setMsgList,
  logList,
  setLogList,
  modelType,
  setModelType,
  isSidebarVisible,
  setIsSidebarVisible,
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);
  const toggleDropdown = () => setIsDropdownVisible(!isDropdownVisible);
  const toggleNewChat = () => window.location.reload();
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
        <button onClick={toggleSidebar} className="text-lg">
          <BiChat />
        </button>
        <Sidebar
          msgList={msgList}
          setMsgList={setMsgList}
          logList={logList}
          setLogList={setLogList}
          isSidebarVisible={isSidebarVisible}
          setIsSidebarVisible={setIsSidebarVisible}
        />
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
              modelType={modelType}
            />
          )}
        </div>
        <button onClick={toggleNewChat} className="text-lg">
          <RiChatNewFill />
        </button>
      </div>
    </header>
  );
};

export default Header;
