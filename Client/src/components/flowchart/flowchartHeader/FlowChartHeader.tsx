import { BsLayoutSidebar } from "react-icons/bs";
import { layoutActions, useAppDispatch, useAppSelector } from "@/redux";

const FlowChartHeader = () => {
  const dispatch = useAppDispatch();
  const isSidebarVisible = useAppSelector(
    (state) => state.layout.isSidebarVisible
  );

  return (
    <header className="sticky top-0 bg-slate-900 text-white p-4 z-50 border-b-2 border-zinc-800 dark:border-x-gray-500 shadow-md">
      <div className="flex items-center justify-center">
        <button
          onClick={() =>
            dispatch(layoutActions.toggleSidebar(!isSidebarVisible))
          }
          className="text-lg hover:text-gray-300"
        >
          <BsLayoutSidebar />
        </button>
        <div className="flex-grow text-center">
          <h1 className="text-lg font-bold">Flowchart</h1>
        </div>
      </div>
    </header>
  );
};

export default FlowChartHeader;
