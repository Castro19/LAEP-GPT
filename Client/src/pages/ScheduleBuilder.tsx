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
  const { currentScheduleTerm, currentSchedule } = useAppSelector(
    (state) => state.schedule
  );

  const {
    selectedSections,
    sectionsForSchedule,
    fetchSelectedSectionsLoading,
  } = useAppSelector((state) => state.sectionSelection);
  const assistantList = useAppSelector(
    (state) => state.assistant.assistantList
  );
  const userId = useAppSelector((state) => state.auth.userId);

  const [tabValue, setTabValue] = useState<
    "spring2025" | "summer2025" | "AI Chat"
  >(currentScheduleTerm);
  // Ref variables to prevent fetching data multiple times
  const hasFetchedassistantList = useRef(false);

  // Fetch the selected sections
  useEffect(() => {
    dispatch(
      sectionSelectionActions.fetchSelectedSectionsAsync(currentScheduleTerm)
    );
  }, [dispatch, currentScheduleTerm]);

  // Fetch the schedules
  useEffect(() => {
    dispatch(scheduleActions.fetchSchedulesAsync(currentScheduleTerm));
  }, [dispatch, currentScheduleTerm]);

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

  // Update tabValue when currentScheduleTerm changes
  useEffect(() => {
    setTabValue(currentScheduleTerm);
  }, [currentScheduleTerm]);

  const handleTermChange = (value: string) => {
    dispatch(
      scheduleActions.setCurrentScheduleTerm(
        value as "spring2025" | "summer2025"
      )
    );
    navigate(`/schedule-builder`);
  };

  return (
    <ScheduleBuilderPageLayout>
      {isNarrowScreen ? (
        <ScheduleBuilderMobile />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-1 gap-4">
          <div className="col-span-1">
            <Tabs
              value={tabValue}
              onValueChange={(value) =>
                setTabValue(value as "spring2025" | "summer2025" | "AI Chat")
              }
              defaultValue={tabValue}
            >
              <TabsList className="grid w-full grid-cols-3 dark:bg-gray-900">
                <TabsTrigger
                  value="spring2025"
                  onClick={() => handleTermChange("spring2025")}
                  className={
                    currentScheduleTerm === "spring2025" ? "bg-primary" : ""
                  }
                >
                  Spring 2025
                </TabsTrigger>
                <TabsTrigger
                  value="summer2025"
                  onClick={() => handleTermChange("summer2025")}
                  className={
                    currentScheduleTerm === "summer2025" ? "bg-primary" : ""
                  }
                >
                  Summer 2025
                </TabsTrigger>
                <TabsTrigger
                  value="AI Chat"
                  disabled={!currentSchedule || !selectedSections}
                >
                  AI Chat
                </TabsTrigger>
              </TabsList>
              <TabsContent value="spring2025">
                <ScheduleBuilderForm onSwitchTab={() => {}} />
              </TabsContent>
              <TabsContent value="summer2025">
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
  const { currentSchedule, currentScheduleTerm } = useAppSelector(
    (state) => state.schedule
  );
  const { selectedSections } = useAppSelector(
    (state) => state.sectionSelection
  );
  const [tabValue, setTabValue] = useState<
    "spring2025" | "summer2025" | "schedule" | "AI Chat"
  >(currentScheduleTerm);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleTermChange = (value: string) => {
    dispatch(
      scheduleActions.setCurrentScheduleTerm(
        value as "spring2025" | "summer2025"
      )
    );
    navigate(`/schedule-builder`);
  };

  return (
    <Tabs
      value={tabValue}
      onValueChange={(value) =>
        setTabValue(
          value as "spring2025" | "summer2025" | "schedule" | "AI Chat"
        )
      }
      defaultValue={currentScheduleTerm}
    >
      <TabsList className="grid w-full grid-cols-4 dark:bg-gray-900">
        <TabsTrigger
          value="spring2025"
          onClick={() => handleTermChange("spring2025")}
          className={currentScheduleTerm === "spring2025" ? "bg-primary" : ""}
        >
          Spring 2025
        </TabsTrigger>
        <TabsTrigger
          value="summer2025"
          onClick={() => handleTermChange("summer2025")}
          className={currentScheduleTerm === "summer2025" ? "bg-primary" : ""}
        >
          Summer 2025
        </TabsTrigger>
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
        <TabsTrigger
          value="AI Chat"
          disabled={!currentSchedule || !selectedSections}
        >
          AI Chat
        </TabsTrigger>
      </TabsList>
      <TabsContent value="spring2025">
        <ScheduleBuilderForm onSwitchTab={() => setTabValue("schedule")} />
      </TabsContent>
      <TabsContent value="summer2025">
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
