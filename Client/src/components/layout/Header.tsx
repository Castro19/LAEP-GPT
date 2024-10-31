import { useState } from "react";
import ModeDropDown from "../customGPT/ModeDropDown";
import Sidebar from "./sidebar/Sidebar";
import { BiChat } from "react-icons/bi";
import NewChat from "../chat/NewChat";
import { GptType } from "@/types";
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
  const isSidebarVisible = useAppSelector(
    (state) => state.layout.isSidebarVisible
  );

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string | undefined>(
    undefined
  );

  const handleModeSelection = (model: GptType) => {
    console.log("model", model);
    if (model && model.id) {
      const modelId = model.id;
      if (modelId === "66ec7a68194da294fe19139e") {
        // FIX: Remove hard coded value of multi-agent model is selected
        setSelectedModelId(modelId);
        dispatch(layoutActions.toggleDropdown(false));
        setIsPopupVisible(true);
      } else {
        dispatch(gptActions.setCurrentGpt(modelId));
        dispatch(layoutActions.toggleDropdown(false));
      }
    }
  };

  return (
    <header className="sticky top-0 bg-gradient-to-b from-indigo-500 to-indigo-700 text-white p-4 z-50 border-b-2 border-zinc-800 dark:border-x-gray-500 shadow-md">
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

        <ModeDropDown onSelect={handleModeSelection} />
        <NewChat />
      </div>
      {isPopupVisible && ( // popup to confirm if user wants to use the multi-agent model (even w/ long loading times)
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="dark:bg-zinc-800 p-6 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Notice</h2>
            <p className="mb-4">
              The enhanced ethics and social justice assistant uses a
              multi-agent model to improve the quality of responses, <br></br>
              but may also take up to a minute to process each message. Do you
              wish to continue?
            </p>
            <div className="flex justify-end">
              <button
                className="mr-4 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded"
                onClick={() => {
                  // user clicked 'No'
                  setIsPopupVisible(false);
                  dispatch(layoutActions.toggleDropdown(true));
                }}
              >
                No
              </button>
              <button
                className="px-4 py-2 bg-gradient-to-b from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white rounded"
                onClick={() => {
                  // user clicked 'Yes'
                  if (selectedModelId) {
                    dispatch(gptActions.setCurrentGpt(selectedModelId));
                    dispatch(layoutActions.toggleDropdown(false));
                    setIsPopupVisible(false);
                  }
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default ChatHeader;
