import React from "react";

// My components
import SectionPageHeader from "./SectionPageHeader";
import MobileHeader from "@/components/layout/MobileHeader";

// Hooks
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";
import OuterSidebar from "../OuterIconSidebar";

type SectionPageLayoutProps = {
  children: React.ReactNode;
};

const SectionPageLayout = ({ children }: SectionPageLayoutProps) => {
  const isMobile = useIsNarrowScreen();

  return (
    <div className="flex flex-col h-full">
      <div className="flex">
        {isMobile ? null : <OuterSidebar />}
        <div
          className={`bg-slate-900 text-white flex flex-col no-scroll w-full ${
            isMobile ? "ml-0" : "ml-2"
          }`}
        >
          {isMobile ? <MobileHeader /> : <SectionPageHeader />}
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default SectionPageLayout;
