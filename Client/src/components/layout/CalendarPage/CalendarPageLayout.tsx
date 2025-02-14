import React from "react";
import CalendarPageHeader from "./CalendarPageHeader";
import OuterSidebar from "../OuterIconSidebar";
import useMobile from "@/hooks/use-mobile";
import MobileHeader from "../MobileHeader";

type SectionPageLayoutProps = {
  children: React.ReactNode;
};

const CalendarPageLayout = ({ children }: SectionPageLayoutProps) => {
  const isMobile = useMobile();
  return (
    <div className="min-h-screen">
      <div className="flex">
        {isMobile ? null : <OuterSidebar />}
        <div
          className={`bg-slate-900 text-white min-h-screen flex flex-col no-scroll w-full ${
            isMobile ? "ml-0" : "ml-2"
          }`}
        >
          {isMobile ? <MobileHeader /> : <CalendarPageHeader />}
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPageLayout;
