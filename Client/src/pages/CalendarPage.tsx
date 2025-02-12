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
import { Calendar } from "@polylink/shared/types";

import { useNavigate, useParams } from "react-router-dom";

const CalendarPage = () => {
  const { calendarId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { calendars, currentCalendar } = useAppSelector(
    (state) => state.calendar
  );
  const { selectedSections } = useAppSelector(
    (state) => state.sectionSelection
  );

  useEffect(() => {
    dispatch(sectionSelectionActions.fetchSelectedSectionsAsync());
  }, [dispatch]);

  useEffect(() => {
    dispatch(calendarActions.fetchCalendarsAsync());
  }, [dispatch]);

  useEffect(() => {
    const fetchCalendar = async () => {
      if (calendarId) {
        const response = await dispatch(
          calendarActions.getCalendarByIdAsync(calendarId)
        );
        const calendar = response.payload as Calendar;
        try {
          if (calendar.sections) {
            dispatch(calendarActions.setCurrentCalendar(calendar));
            dispatch(calendarActions.setCalendars([]));
            dispatch(calendarActions.setPage(1));
            dispatch(calendarActions.setTotalPages(1));
          }
        } catch (error) {
          if (environment === "dev") {
            console.error("Error fetching calendar: ", error);
          }
        }
      }
    };
    fetchCalendar();
  }, [calendarId, dispatch]);

  const handleBuildSchedule = () => {
    if (environment === "dev") {
      console.log("Building schedule...");
    }
    // Create all combinations of sections
    const allCombinations = generateAllScheduleCombinations(selectedSections);
    dispatch(calendarActions.setCalendars(allCombinations));
    dispatch(calendarActions.setPage(1));
    dispatch(calendarActions.setTotalPages(allCombinations.length));
    dispatch(calendarActions.setCurrentCalendar(allCombinations[0]));
    navigate("/calendar");
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
          {calendars.length === 0 && currentCalendar === null ? (
            <EmptyCalendar />
          ) : (
            <CalendarContainer />
          )}
        </div>
      </div>
    </CalendarPageLayout>
  );
};

export default CalendarPage;
