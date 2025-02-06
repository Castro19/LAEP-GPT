import React from "react";
import CalendarPageHeader from "./CalendarPageHeader";

type SectionPageLayoutProps = {
  children: React.ReactNode;
};

const CalendarPageLayout = ({ children }: SectionPageLayoutProps) => {
  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col no-scroll w-full">
      <CalendarPageHeader />
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default CalendarPageLayout;
