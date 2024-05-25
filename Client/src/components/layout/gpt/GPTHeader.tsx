import { useAppDispatch, useAppSelector, layoutActions } from "@/redux";
import Sidebar from "../sidebar/Sidebar";
import { BiChat } from "react-icons/bi";

const GPTHeader = () => {
  const isSidebarVisible = useAppSelector(
    (state) => state.layout.isSidebarVisible
  );
  const dispatch = useAppDispatch();
  const toggleSidebar = () =>
    dispatch(layoutActions.toggleSidebar(!isSidebarVisible));

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
