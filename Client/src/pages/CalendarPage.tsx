import CalendarContainer from "@/components/calendar/CalendarContainer";
import CalendarPageLayout from "@/components/layout/CalendarPage/CalendarPageLayout";
import SelectedSectionContainer from "@/components/calendar/SelectedSectionContainer";
import CalendarSideOptions from "@/components/calendar/CalendarSideOptions";
import { calendarActions, useAppDispatch, useAppSelector } from "@/redux";
import { sectionSelectionActions } from "@/redux";
import { useEffect } from "react";
import { environment } from "@/helpers/getEnvironmentVars";
import { generateAllScheduleCombinations } from "@/components/calendar/helpers/buildSchedule";
import EmptyCalendar from "@/components/calendar/EmptyCalendar";

const CalendarPage = () => {
  const dispatch = useAppDispatch();
  const { calendars } = useAppSelector((state) => state.calendar);
  const { selectedSections } = useAppSelector(
    (state) => state.sectionSelection
  );

  useEffect(() => {
    dispatch(sectionSelectionActions.fetchSelectedSectionsAsync());
  }, [dispatch]);

  const handleBuildSchedule = () => {
    if (environment === "dev") {
      console.log("Building schedule...");
    }
    // Create all combinations of sections
    const allCombinations = generateAllScheduleCombinations(selectedSections);
    dispatch(calendarActions.setCalendars(allCombinations));
    dispatch(calendarActions.setPage(1));
    dispatch(calendarActions.setTotalPages(allCombinations.length));
  };

  return (
    <CalendarPageLayout>
      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-1 gap-4">
        <div className="col-span-1">
          <CalendarSideOptions onClick={handleBuildSchedule}>
            <SelectedSectionContainer />
          </CalendarSideOptions>
          {/* <ScheduleBuilderQueryForm /> */}
        </div>
        <div className="col-span-3">
          {calendars.length > 0 ? <CalendarContainer /> : <EmptyCalendar />}
        </div>
      </div>
    </CalendarPageLayout>
  );
};

export default CalendarPage;
