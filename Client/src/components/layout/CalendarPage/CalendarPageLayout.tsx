import React from "react";
import CalendarPageHeader from "./CalendarPageHeader";
import OuterSidebar from "../OuterIconSidebar";
import useMobile from "@/hooks/use-mobile";
import MobileHeader from "../MobileHeader";
import CalendarPageSidebar from "./CalendarPageSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

type SectionPageLayoutProps = {
  children: React.ReactNode;
};

const CalendarPageLayout = ({ children }: SectionPageLayoutProps) => {
  const isMobile = useMobile();
  return (
    <div className="flex flex-col h-full">
      <div className="flex">
        {isMobile ? null : <OuterSidebar />}
        <SidebarProvider className="dark:bg-slate-900" defaultOpen={false}>
          <div
            className={`bg-slate-900 text-white flex flex-col no-scroll w-full ${
              isMobile ? "ml-0" : "ml-2"
            }`}
          >
            {isMobile ? <MobileHeader /> : <CalendarPageHeader />}
            <div className="flex-1">{children}</div>
          </div>
          <CalendarPageSidebar />
        </SidebarProvider>
      </div>
    </div>
  );
};

export default CalendarPageLayout;
