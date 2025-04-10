import {
  assistantActions,
  calendarActions,
  useAppDispatch,
  useAppSelector,
} from "@/redux";
import { useNavigate, useParams } from "react-router-dom";
import { sectionSelectionActions } from "@/redux";
import { useEffect, useRef, useState } from "react";
import { environment } from "@/helpers/getEnvironmentVars";

// Components
import CalendarPageLayout from "@/components/layout/CalendarPage/CalendarPageLayout";
import CalendarBuilderForm from "@/components/calendar/buildSchedule/CalendarBuilderForm";
import {
  EmptyCalendar,
  CalendarContainer,
  CalendarAIChatContainer,
  PaginationFooter,
  NoSelectedSections,
} from "@/components/calendar";
import { onNewChat } from "@/components/chat";
// Types
import { Calendar } from "@polylink/shared/types";
// UI Components
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Hooks
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";

const CalendarPage = () => {
  const isNarrowScreen = useIsNarrowScreen();
  const { calendarId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentChatId, error, loading, messagesByChatId } = useAppSelector(
    (state) => state.message
  );
  const { currentCalendar } = useAppSelector((state) => state.calendar);
  const { selectedSections } = useAppSelector(
    (state) => state.sectionSelection
  );
  const assistantList = useAppSelector(
    (state) => state.assistant.assistantList
  );
  const userId = useAppSelector((state) => state.auth.userId);

  // Ref variables to prevent fetching data multiple times
  const hasFetchedassistantList = useRef(false);
  const hasFetchedSelectedSections = useRef(false);
  const hasFetchedCalendars = useRef(false);

  // Fetch the selected sections
  useEffect(() => {
    if (hasFetchedSelectedSections.current) return;
    hasFetchedSelectedSections.current = true;
    dispatch(sectionSelectionActions.fetchSelectedSectionsAsync());
  }, [dispatch]);

  // Fetch the calendars
  useEffect(() => {
    if (hasFetchedCalendars.current) return;
    hasFetchedCalendars.current = true;
    dispatch(calendarActions.fetchCalendarsAsync());
  }, [dispatch]);

  // Fetch the current calendar by ID (if it exists)
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

  // Fetch the assistant list
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

  // Set the Assistant to the Schedule Analysis
  useEffect(() => {
    if (assistantList.length > 0) {
      dispatch(assistantActions.setAssistantByTitle("Schedule Analysis"));
    }
  }, [assistantList, dispatch]);

  // Start a new chat when the page is loaded
  useEffect(() => {
    onNewChat(
      currentChatId,
      dispatch,
      navigate,
      error,
      loading,
      messagesByChatId,
      true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, navigate]);

  return (
    <CalendarPageLayout>
      {isNarrowScreen ? (
        <CalendarMobile />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-1 gap-4">
          <div className="col-span-1">
            <Tabs defaultValue="Build Schedule">
              <TabsList className="grid w-full grid-cols-2 dark:bg-gray-900">
                <TabsTrigger value="Build Schedule">Build Schedule</TabsTrigger>
                <TabsTrigger
                  value="AI Chat"
                  disabled={!currentCalendar || !selectedSections}
                >
                  AI Chat
                </TabsTrigger>
              </TabsList>
              <TabsContent value="Build Schedule">
                <CalendarBuilderForm onSwitchTab={() => {}} />
              </TabsContent>
              <TabsContent value="AI Chat">
                <CalendarAIChatContainer />
              </TabsContent>
            </Tabs>
          </div>
          <div className="col-span-3 items-start justify-start">
            {currentCalendar === null ? (
              <div className="items-start justify-start">
                {!selectedSections || selectedSections.length === 0 ? (
                  <NoSelectedSections />
                ) : (
                  <EmptyCalendar />
                )}
              </div>
            ) : (
              <>
                <CalendarContainer />
                <PaginationFooter />
              </>
            )}
          </div>
        </div>
      )}
    </CalendarPageLayout>
  );
};

const CalendarMobile = () => {
  const { currentCalendar } = useAppSelector((state) => state.calendar);
  const { selectedSections } = useAppSelector(
    (state) => state.sectionSelection
  );
  const [tabValue, setTabValue] = useState("Build Schedule");

  return (
    <Tabs
      value={tabValue}
      onValueChange={(value) => setTabValue(value)}
      defaultValue="Build Schedule"
    >
      <TabsList className="grid w-full grid-cols-3 dark:bg-gray-900">
        <TabsTrigger value="Build Schedule">Build Schedule</TabsTrigger>
        <TabsTrigger value="Calendar">Calendar</TabsTrigger>

        <TabsTrigger
          value="AI Chat"
          disabled={!currentCalendar || !selectedSections}
        >
          AI Chat
        </TabsTrigger>
      </TabsList>
      <TabsContent value="Build Schedule">
        <CalendarBuilderForm onSwitchTab={() => setTabValue("Calendar")} />
      </TabsContent>
      <TabsContent value="Calendar">
        <CalendarContainer />
        <PaginationFooter />
      </TabsContent>
      <TabsContent value="AI Chat">
        <CalendarAIChatContainer />
      </TabsContent>
    </Tabs>
  );
};

export default CalendarPage;
