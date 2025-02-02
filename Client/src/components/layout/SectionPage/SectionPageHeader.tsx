import { useSidebar } from "@/components/ui/sidebar";

import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarLeftExpand,
} from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const SectionPageHeader = () => {
  const { toggleSidebar, open } = useSidebar();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 bg-slate-900 text-white p-4 z-50 border-b-2 border-zinc-800 dark:border-slate-700 shadow-md">
      <div className="flex items-center justify-between">
        <button onClick={toggleSidebar} className="text-lg hover:text-gray-300">
          {open ? (
            <TbLayoutSidebarLeftCollapse />
          ) : (
            <TbLayoutSidebarLeftExpand />
          )}
        </button>
        <div className="text-2xl font-bold leading-tight text-center">
          Class Search
        </div>
        <div className="flex items-center gap-2">
          {/* <button
            onClick={() => navigate("/chat")}
            className="absolute left-4 text-lg hover:bg-transparent"
          >
            <ChevronLeft className="w-5 h-5 transition-transform duration-200 hover:-translate-x-1 size-10" />
          </button> */}
        </div>
      </div>
    </header>
  );
};

export default SectionPageHeader;
