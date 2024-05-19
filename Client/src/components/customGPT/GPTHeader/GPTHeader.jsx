import React from "react";
import { BiChat } from "react-icons/bi";

import Sidebar from "../../layout/Sidebar";
import { toggleSidebar as toggleReduxSidebar } from "../../../redux/layout/layoutSlice";
import { useSelector, useDispatch } from "react-redux";

const GPTHeader = () => {
  const isSidebarVisible = useSelector(
    (state) => state.layout.isSidebarVisible
  );
  const dispatch = useDispatch();
  const toggleSidebar = () => dispatch(toggleReduxSidebar(!isSidebarVisible));

  return (
    <header className="sticky top-0 bg-white dark:bg-gray-800 text-white p-4 z-50 shadow-md">
      {!isSidebarVisible && (
        <button onClick={toggleSidebar} className="text-lg">
          <BiChat />
        </button>
      )}
      <Sidebar />
    </header>
  );
};

export default GPTHeader;
