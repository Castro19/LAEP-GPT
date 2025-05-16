import React from "react";
import OuterIconSidebar from "../dynamicLayouts/OuterIconSidebar";
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";
import MobileHeader from "../dynamicLayouts/MobileHeader";

type SectionPageLayoutProps = {
  children: React.ReactNode;
};

const ScheduleBuilderPageLayout = ({ children }: SectionPageLayoutProps) => {
  const isNarrowScreen = useIsNarrowScreen();
  return (
    <div className="flex flex-col h-full">
      <div className="flex">
        {isNarrowScreen ? null : <OuterIconSidebar />}
        <div
          className={`bg-slate-900 text-white flex flex-col no-scroll w-full ${
            isNarrowScreen ? "ml-0" : "ml-2"
          }`}
        >
          {isNarrowScreen ? <MobileHeader /> : null}
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleBuilderPageLayout;
