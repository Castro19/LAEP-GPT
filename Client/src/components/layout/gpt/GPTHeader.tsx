import { useAppDispatch, useAppSelector, layoutActions } from "@/redux";
import Sidebar from "../sidebar/Sidebar";
import { BiChat } from "react-icons/bi";
import NewChat from "../../chat/NewChat";

const GPTHeader = () => {
  const isSidebarVisible = useAppSelector(
    (state) => state.layout.isSidebarVisible
  );
  const dispatch = useAppDispatch();
  const toggleSidebar = () =>
    dispatch(layoutActions.toggleSidebar(!isSidebarVisible));

  return (
    <header className="sticky top-0 bg-gradient-to-b from-indigo-500 to-indigo-700 text-white p-4 z-50 shadow-md">
      <div className="flex items-center">
        {!isSidebarVisible && (
          <button onClick={toggleSidebar} className="text-lg">
            <BiChat />
          </button>
        )}
        <div className="ml-auto">
          <NewChat />
        </div>
      </div>
      <Sidebar />
    </header>
  );
};

export default GPTHeader;
