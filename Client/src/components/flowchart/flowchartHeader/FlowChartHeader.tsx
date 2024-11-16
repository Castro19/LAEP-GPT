// FlowChartHeader.tsx
import { useSidebar } from "@/components/ui/sidebar";
import { BsLayoutSidebar } from "react-icons/bs";

const FlowChartHeader = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 bg-slate-900 text-white p-4 z-50 border-b-2 border-zinc-800 dark:border-x-gray-500 shadow-md transition-all duration-300">
      <div className="flex items-center justify-center">
        <button onClick={toggleSidebar} className="text-lg hover:text-gray-300">
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
