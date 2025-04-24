import React from "react";

// My components
import SectionPageHeader from "./SectionPageHeader";
import MobileHeader from "@/components/layout/dynamicLayouts/MobileHeader";

// Hooks
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";
import OuterIconSidebar from "../dynamicLayouts/OuterIconSidebar";

type SectionPageLayoutProps = {
  children: React.ReactNode;
};

const SectionPageLayout = ({ children }: SectionPageLayoutProps) => {
  const isNarrowScreen = useIsNarrowScreen();

  return (
    <div className="flex flex-col h-full">
      <div className="flex">
        {isNarrowScreen ? null : <OuterIconSidebar />}
        <div
          className={`bg-background text-white flex flex-col no-scroll w-full ${
            isNarrowScreen ? "ml-0" : "ml-2"
          }`}
        >
          {isNarrowScreen ? <MobileHeader /> : <SectionPageHeader />}
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default SectionPageLayout;
