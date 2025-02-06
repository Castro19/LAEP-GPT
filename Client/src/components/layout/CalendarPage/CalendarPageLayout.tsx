import React from "react";
import CalendarPageHeader from "./CalendarPageHeader";
import OuterSidebar from "../OuterIconSidebar";

type SectionPageLayoutProps = {
  children: React.ReactNode;
};

const CalendarPageLayout = ({ children }: SectionPageLayoutProps) => {
  return (
    <div className="min-h-screen">
      <div className="flex">
        <OuterSidebar />
        <div className="bg-slate-900 text-white min-h-screen flex flex-col no-scroll w-full ml-2">
          <CalendarPageHeader />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPageLayout;
