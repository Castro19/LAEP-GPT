import CalendarContainer from "@/components/calendar/CalendarContainer";
import CalendarPageLayout from "@/components/layout/CalendarPage/CalendarPageLayout";
import SelectedSectionContainer from "@/components/calendar/SelectedSectionContainer";
import BuildScheduleContainer from "@/components/calendar/BuildScheduleContainer";
import {
  assistantActions,
  calendarActions,
  useAppDispatch,
  useAppSelector,
} from "@/redux";
import { sectionSelectionActions } from "@/redux";
import { useEffect, useRef } from "react";
import { environment } from "@/helpers/getEnvironmentVars";
import { generateAllScheduleCombinations } from "@/components/calendar/helpers/buildSchedule";
import EmptyCalendar from "@/components/calendar/EmptyCalendar";
import { Calendar } from "@polylink/shared/types";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import {
  TabsContent,
  Tabs,
  TabsList,
  TabsTrigger,
  CustomTabsTrigger,
} from "@/components/ui/tabs";
import { ChatContainer } from "@/components/chat";

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
  const assistantList = useAppSelector(
    (state) => state.assistant.assistantList
  );
  const userId = useAppSelector((state) => state.auth.userId);
  const hasFetchedassistantList = useRef(false);
  const { toast } = useToast();
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

  useEffect(() => {
    if (hasFetchedassistantList.current || assistantList.length > 0) return;
    hasFetchedassistantList.current = true;

    const fetchassistantList = async () => {
      if (userId) {
        console;
        try {
          dispatch(assistantActions.fetchAll());
        } catch (error) {
          if (environment === "dev") {
            console.error("Error fetching GPT list: ", error);
          }
        }
      }
    };
    fetchassistantList();
  }, [assistantList.length, dispatch, userId]);

  // Set the Assistant to the Schedule Builder
  useEffect(() => {
    if (assistantList.length > 0) {
      dispatch(assistantActions.setAssistantByTitle("Schedule Builder"));
    }
  }, [assistantList, dispatch]);

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
          <Tabs defaultValue="Build Schedule">
            <TabsList className="grid w-full grid-cols-2 dark:bg-gray-900">
              <TabsTrigger value="Build Schedule">Build Schedule</TabsTrigger>
              <CustomTabsTrigger
                value="AI Chat"
                disabled={!currentCalendar || !selectedSections}
                showToast={() => {
                  if (!currentCalendar || !selectedSections) {
                    toast({
                      title:
                        "Please select sections and build a schedule first.",
                      description:
                        "You can build a schedule by clicking the 'Build Schedule' tab.",
                    });
                  }
                }}
              >
                AI Chat
              </CustomTabsTrigger>
            </TabsList>
            <TabsContent value="Build Schedule">
              <BuildScheduleContainer onClick={handleBuildSchedule}>
                <SelectedSectionContainer />
              </BuildScheduleContainer>
            </TabsContent>
            <TabsContent value="AI Chat">
              <ChatContainer />
            </TabsContent>
          </Tabs>
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
