import AdminViewOnly from "@/components/security/AdminViewOnly";
import OuterSidebar from "@/components/layout/OuterIconSidebar";
import CalendarContainer from "@/components/calendar/CalendarContainer";
import CalendarPageLayout from "@/components/layout/CalendarPage/CalendarPageLayout";
import SelectedSectionContainer from "@/components/calendar/SelectedSectionContainer";

const CalendarPage = () => {
  return (
    <AdminViewOnly>
      <div className="flex">
        <OuterSidebar />
        <CalendarPageLayout>
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-1 gap-4">
            <div className="col-span-1">
              <SelectedSectionContainer />
            </div>
            <div className="col-span-3">
              <CalendarContainer />
            </div>
          </div>
        </CalendarPageLayout>
      </div>
    </AdminViewOnly>
  );
};

export default CalendarPage;
