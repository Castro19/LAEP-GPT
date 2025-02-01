import { useSidebar } from "@/components/ui/sidebar";

import {
  TbLayoutSidebarRightCollapse,
  TbLayoutSidebarRightExpand,
} from "react-icons/tb";

const SectionPageHeader = () => {
  const { toggleSidebar, open } = useSidebar();

  return (
    <header className="sticky top-0 bg-slate-900 text-white p-4 z-50 border-b-2 border-zinc-800 dark:border-slate-700 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"></div>
        <div className="text-2xl font-bold leading-tight text-center">
          Class Search
        </div>
        <button onClick={toggleSidebar} className="text-lg hover:text-gray-300">
          {open ? (
            <TbLayoutSidebarRightCollapse />
          ) : (
            <TbLayoutSidebarRightExpand />
          )}
        </button>
      </div>
    </header>
  );
};

export default SectionPageHeader;
