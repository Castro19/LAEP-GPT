import CalendarPageLayout from "@/components/layout/CalendarPage/CalendarPageLayout";
import {
  assistantActions,
  calendarActions,
  useAppDispatch,
  useAppSelector,
} from "@/redux";
import { sectionSelectionActions } from "@/redux";
import { useEffect, useRef } from "react";
import { environment } from "@/helpers/getEnvironmentVars";
import { generateAllScheduleCombinations } from "@/components/calendar";
import {
  EmptyCalendar,
  CalendarContainer,
  BuildScheduleContainer,
  SelectedSectionContainer,
  LeftSectionFooter,
  CalendarAIChatContainer,
  PaginationFooter,
} from "@/components/calendar";
import { Calendar } from "@polylink/shared/types";
import { useNavigate, useParams } from "react-router-dom";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { onNewChat } from "@/components/chat";

import useMobile from "@/hooks/use-mobile";

const CalendarPage = () => {
  const isMobile = useMobile();
  const { calendarId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentChatId, error, loading, messagesByChatId } = useAppSelector(
    (state) => state.message
  );
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

  // Fetch the selected sections
  useEffect(() => {
    dispatch(sectionSelectionActions.fetchSelectedSectionsAsync());
  }, [dispatch]);

  // Fetch the calendars
  useEffect(() => {
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

  // Set the Assistant to the Schedule Builder
  useEffect(() => {
    if (assistantList.length > 0) {
      dispatch(assistantActions.setAssistantByTitle("Schedule Builder"));
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

  // Handle the build schedule button click
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

  const handleSaveSchedule = () => {
    if (currentCalendar) {
      dispatch(
        calendarActions.createOrUpdateCalendarAsync(currentCalendar.sections)
      );
    }
  };

  return (
    <CalendarPageLayout>
      {isMobile ? (
        <CalendarMobile handleBuildSchedule={handleBuildSchedule} />
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
                <BuildScheduleContainer onClick={handleBuildSchedule}>
                  <SelectedSectionContainer />
                </BuildScheduleContainer>
                <LeftSectionFooter
                  formText="New Schedule"
                  buttonText="Save Schedule"
                  onFormSubmit={handleBuildSchedule}
                  onClick={handleSaveSchedule}
                />
              </TabsContent>
              <TabsContent value="AI Chat">
                <CalendarAIChatContainer />
              </TabsContent>
            </Tabs>
          </div>
          <div className="col-span-3">
            {calendars.length === 0 && currentCalendar === null ? (
              <EmptyCalendar />
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

type CalendarMobileProps = {
  handleBuildSchedule: () => void;
};

const CalendarMobile = ({ handleBuildSchedule }: CalendarMobileProps) => {
  const { currentCalendar } = useAppSelector((state) => state.calendar);
  const { selectedSections } = useAppSelector(
    (state) => state.sectionSelection
  );

  return (
    <Tabs defaultValue="Build Schedule">
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
        <BuildScheduleContainer onClick={handleBuildSchedule}>
          <SelectedSectionContainer />
        </BuildScheduleContainer>

        <LeftSectionFooter
          formText="Build Schedule"
          buttonText="Save Schedule"
          onClick={handleBuildSchedule}
          onFormSubmit={handleBuildSchedule}
        />
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
