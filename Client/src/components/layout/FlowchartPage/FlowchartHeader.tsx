// FlowchartHeader.tsx
// Hooks
import { useSidebar } from "@/components/ui/sidebar";

// UI Components & Icons
import { Button } from "@/components/ui/button";
import { BsLayoutSidebar } from "react-icons/bs";

const FlowchartHeader = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 bg-slate-900 text-white p-1 z-50 border-b-2 dark:border-slate-700 shadow-md transition-all duration-300 ml-2">
      <div className="flex items-center justify-between relative w-full">
        <Button
          variant="ghost"
          onClick={toggleSidebar}
          className="text-lg hover:text-gray-300"
        >
          <BsLayoutSidebar />
        </Button>
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-lg font-bold">Flowchart</h1>
        </div>
      </div>
    </header>
  );
};

export default FlowchartHeader;
