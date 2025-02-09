import AdminViewOnly from "@/components/security/AdminViewOnly";
import CalendarContainer from "@/components/calendar/CalendarContainer";
import CalendarPageLayout from "@/components/layout/CalendarPage/CalendarPageLayout";
import SelectedSectionContainer from "@/components/calendar/SelectedSectionContainer";
import CalendarSideOptions from "@/components/calendar/CalendarSideOptions";
import { useAppDispatch } from "@/redux";
import { sectionSelectionActions } from "@/redux";
import { useEffect } from "react";

const CalendarPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(sectionSelectionActions.fetchSelectedSectionsAsync());
  }, [dispatch]);

  return (
    <AdminViewOnly>
      <CalendarPageLayout>
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-1 gap-4">
          <div className="col-span-1">
            <CalendarSideOptions>
              <SelectedSectionContainer />
            </CalendarSideOptions>
            {/* <ScheduleBuilderQueryForm /> */}
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
