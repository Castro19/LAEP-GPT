import React from "react";
import CalendarPageHeader from "./CalendarPageHeader";
import OuterIconSidebar from "../dynamicLayouts/OuterIconSidebar";
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";
import MobileHeader from "../dynamicLayouts/MobileHeader";

type SectionPageLayoutProps = {
  children: React.ReactNode;
};

const CalendarPageLayout = ({ children }: SectionPageLayoutProps) => {
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
          {isNarrowScreen ? <MobileHeader /> : <CalendarPageHeader />}
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPageLayout;
