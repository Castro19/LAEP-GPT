import ModeDropDown from "../customGPT/ModeDropDown";
import Sidebar from "./Sidebar";
import { BiChat } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import NewChat from "../chat/NewChat";
// import { useUI } from "../contexts/UIContext";

// Redux:
import {
  useAppSelector,
  useAppDispatch,
  gptActions,
  layoutActions,
} from "@/redux";

const ChatHeader = () => {
  // Redux:
  const dispatch = useAppDispatch();
  const isDropdownVisible = useAppSelector(
    (state) => state.layout.isDropdownVisible
  );
  const isSidebarVisible = useAppSelector(
    (state) => state.layout.isSidebarVisible
  );

  const handleModeSelection = (modelId: string | undefined) => {
    console.log(modelId);

    if (modelId) {
      dispatch(gptActions.setCurrentGpt(modelId));
      dispatch(layoutActions.toggleDropdown(false));
    }
  };

  return (
    <header className="sticky top-0 bg-white dark:bg-gray-800 text-white p-4 z-50 border-b-2 border-gray-300 dark:border-x-gray-500 shadow-md">
      {" "}
      <div className="flex items-center justify-between">
        <button
          onClick={() =>
            dispatch(layoutActions.toggleSidebar(!isSidebarVisible))
          }
          className="text-lg hover:text-gray-300"
        >
          <BiChat />
        </button>
        <Sidebar />
        <div>
          <button
            onClick={() =>
              dispatch(layoutActions.toggleDropdown(!isDropdownVisible))
            }
            className="relative inline-flex items-center text-lg bg-white dark:bg-gray-800 hover:text-gray-300"
          >
            LAEP Chatbot
            <span className="ml-4">
              <IoIosArrowDown />
            </span>
          </button>
          {isDropdownVisible && <ModeDropDown onSelect={handleModeSelection} />}
        </div>
        <NewChat />
      </div>
    </header>
  );
};

export default ChatHeader;
