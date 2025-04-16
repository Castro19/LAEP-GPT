import {
  assistantActions,
  scheduleActions,
  useAppDispatch,
  useAppSelector,
} from "@/redux";
import { useNavigate, useParams } from "react-router-dom";
import { sectionSelectionActions } from "@/redux";
import { useEffect, useRef, useState } from "react";
import { environment } from "@/helpers/getEnvironmentVars";

// Components
import ScheduleBuilderPageLayout from "@/components/layout/ScheduleBuilderPage/ScheduleBuilderPageLayout";
import ScheduleBuilderForm from "@/components/scheduleBuilder/buildSchedule/ScheduleBuilderForm";
import {
  EmptySchedule,
  ScheduleContainer,
  ScheduleBuilderAIChat,
  PaginationFooter,
  NoSelectedSections,
} from "@/components/scheduleBuilder";
import { onNewChat } from "@/components/chat";
// Types
import { Schedule } from "@polylink/shared/types";
// UI Components
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Hooks
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";

const ScheduleBuilderPage = () => {
  const isNarrowScreen = useIsNarrowScreen();
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentChatId, error, loading, messagesByChatId } = useAppSelector(
    (state) => state.message
  );
  const { currentSchedule } = useAppSelector((state) => state.schedule);
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
  const hasFetchedSchedules = useRef(false);

  // Fetch the selected sections
  useEffect(() => {
    if (hasFetchedSelectedSections.current) return;
    hasFetchedSelectedSections.current = true;
    dispatch(sectionSelectionActions.fetchSelectedSectionsAsync("spring2025"));
  }, [dispatch]);

  // Fetch the schedules
  useEffect(() => {
    if (hasFetchedSchedules.current) return;
    hasFetchedSchedules.current = true;
    dispatch(scheduleActions.fetchSchedulesAsync());
  }, [dispatch]);

  // Fetch the current schedule by ID (if it exists)
  useEffect(() => {
    const fetchSchedule = async () => {
      if (scheduleId) {
        const response = await dispatch(
          scheduleActions.getScheduleByIdAsync(scheduleId)
        );
        const schedule = response.payload as Schedule;
        try {
          if (schedule.sections) {
            dispatch(scheduleActions.setCurrentSchedule(schedule));
            dispatch(scheduleActions.setSchedules([]));
            dispatch(scheduleActions.setPage(1));
            dispatch(scheduleActions.setTotalPages(1));
          }
        } catch (error) {
          if (environment === "dev") {
            console.error("Error fetching schedule: ", error);
          }
        }
      }
    };
    fetchSchedule();
  }, [scheduleId, dispatch]);

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
    <ScheduleBuilderPageLayout>
      {isNarrowScreen ? (
        <ScheduleBuilderMobile />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-1 gap-4">
          <div className="col-span-1">
            <Tabs defaultValue="build-schedule">
              <TabsList className="grid w-full grid-cols-2 dark:bg-gray-900">
                <TabsTrigger value="build-schedule">Build Schedule</TabsTrigger>
                <TabsTrigger
                  value="AI Chat"
                  disabled={!currentSchedule || !selectedSections}
                >
                  AI Chat
                </TabsTrigger>
              </TabsList>
              <TabsContent value="build-schedule">
                <ScheduleBuilderForm onSwitchTab={() => {}} />
              </TabsContent>
              <TabsContent value="AI Chat">
                <ScheduleBuilderAIChat />
              </TabsContent>
            </Tabs>
          </div>
          <div className="col-span-3 items-start justify-start">
            {currentSchedule === null ? (
              <div className="items-start justify-start">
                {!selectedSections || selectedSections.length === 0 ? (
                  <NoSelectedSections />
                ) : (
                  <EmptySchedule />
                )}
              </div>
            ) : (
              <>
                <ScheduleContainer />
                <PaginationFooter />
              </>
            )}
          </div>
        </div>
      )}
    </ScheduleBuilderPageLayout>
  );
};

const ScheduleBuilderMobile = () => {
  const { currentSchedule } = useAppSelector((state) => state.schedule);
  const { selectedSections } = useAppSelector(
    (state) => state.sectionSelection
  );
  const [tabValue, setTabValue] = useState<"build-schedule" | "schedule">(
    "build-schedule"
  );

  return (
    <Tabs
      value={tabValue}
      onValueChange={(value) =>
        setTabValue(value as "build-schedule" | "schedule")
      }
      defaultValue="build-schedule"
    >
      <TabsList className="grid w-full grid-cols-3 dark:bg-gray-900">
        <TabsTrigger value="build-schedule">Build Schedule</TabsTrigger>
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
        <TabsTrigger
          value="AI Chat"
          disabled={!currentSchedule || !selectedSections}
        >
          AI Chat
        </TabsTrigger>
      </TabsList>
      <TabsContent value="build-schedule">
        <ScheduleBuilderForm onSwitchTab={() => setTabValue("schedule")} />
      </TabsContent>
      <TabsContent value="schedule">
        <ScheduleContainer />
        <PaginationFooter />
      </TabsContent>
      <TabsContent value="AI Chat">
        <ScheduleBuilderAIChat />
      </TabsContent>
    </Tabs>
  );
};

export default ScheduleBuilderPage;
