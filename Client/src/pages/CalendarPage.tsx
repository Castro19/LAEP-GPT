import SectionPageLayout from "@/components/layout/SectionPage/SectionPageLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminViewOnly from "@/components/security/AdminViewOnly";
import OuterSidebar from "@/components/layout/OuterIconSidebar";
import CalendarContainer from "@/components/calendar/CalendarContainer";

const CalendarPage = () => {
  return (
    <AdminViewOnly>
      <div className="flex">
        <OuterSidebar />
        <SidebarProvider className="dark:bg-slate-900">
          <SectionPageLayout>
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-1 gap-4">
              <div className="col-span-1"></div>
              <div className="col-span-3">
                <CalendarContainer />
              </div>
            </div>
          </SectionPageLayout>
        </SidebarProvider>
      </div>
    </AdminViewOnly>
  );
};

export default CalendarPage;
