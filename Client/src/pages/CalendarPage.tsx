import AdminViewOnly from "@/components/security/AdminViewOnly";

import CalendarContainer from "@/components/calendar/CalendarContainer";
import CalendarPageLayout from "@/components/layout/CalendarPage/CalendarPageLayout";
// import SelectedSectionContainer from "@/components/calendar/SelectedSectionContainer";
import ScheduleBuilderQueryForm from "@/components/calendar/ScheduleBuilderQueryForm";

const CalendarPage = () => {
  return (
    <AdminViewOnly>
      <CalendarPageLayout>
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-1 gap-4">
          <div className="col-span-1">
            {/* <SelectedSectionContainer /> */}
            <ScheduleBuilderQueryForm />
          </div>
          <div className="col-span-3">
            <CalendarContainer />
          </div>
        </div>
      </CalendarPageLayout>
    </AdminViewOnly>
  );
};

export default CalendarPage;
