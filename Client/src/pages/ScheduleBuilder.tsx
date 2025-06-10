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
  PaginationFooter,
  NoSelectedSections,
} from "@/components/scheduleBuilder";
// Types
import { CourseTerm, Schedule } from "@polylink/shared/types";
// UI Components
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Hooks
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";

const ScheduleBuilderPage = () => {
  const isNarrowScreen = useIsNarrowScreen();
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentScheduleTerm, currentSchedule, currentScheduleId } =
    useAppSelector((state) => state.schedule);

  const { selectedSections } = useAppSelector(
    (state) => state.sectionSelection
  );
  const assistantList = useAppSelector(
    (state) => state.assistant.assistantList
  );
  const userId = useAppSelector((state) => state.auth.userId);

  const [tabValue, setTabValue] = useState<CourseTerm | "schedule" | "AI Chat">(
    currentScheduleTerm
  );
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

  // Update tabValue when currentScheduleTerm changes
  useEffect(() => {
    setTabValue(currentScheduleTerm);
  }, [currentScheduleTerm]);

  // Handle navigation when currentScheduleId changes
  useEffect(() => {
    // Only navigate if we're not already on the correct URL and this is a new/updated schedule
    if (currentScheduleId && currentScheduleId !== scheduleId && !scheduleId) {
      navigate(`/schedule-builder/${currentScheduleId}`);
    }
  }, [currentScheduleId, scheduleId, navigate]);

  const handleTermChange = (value: string) => {
    dispatch(scheduleActions.setCurrentScheduleTerm(value as CourseTerm));
    dispatch(scheduleActions.setCurrentScheduleId(undefined));
    navigate("/schedule-builder");
  };

  return (
    <ScheduleBuilderPageLayout>
      {isNarrowScreen ? (
        <ScheduleBuilderMobile />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-1 gap-4 mt-2">
          <div className="col-span-1">
            <Tabs
              value={tabValue}
              onValueChange={(value) =>
                setTabValue(value as CourseTerm | "schedule")
              }
              defaultValue={tabValue}
              className="space-y-2"
            >
              <Card className="bg-card/50 border-border/50">
                <CardHeader className="flex flex-col items-center justify-center p-2">
                  <CardTitle className="text-center">
                    Schedule Builder
                  </CardTitle>
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    Click to select a term
                  </div>
                </CardHeader>
                {/* border */}
                <div className="border-t border-border/50"></div>
                <CardContent>
                  <TabsList className="grid w-full grid-cols-3 dark:bg-gray-900/50 bg-gray-100/50 p-1 rounded-lg">
                    <TabsTrigger
                      value="spring2025"
                      onClick={() => handleTermChange("spring2025")}
                      className={
                        currentScheduleTerm === "spring2025" ? "bg-primary" : ""
                      }
                    >
                      SP25
                    </TabsTrigger>
                    <TabsTrigger
                      value="summer2025"
                      onClick={() => handleTermChange("summer2025")}
                      className={
                        currentScheduleTerm === "summer2025" ? "bg-primary" : ""
                      }
                    >
                      SU25
                    </TabsTrigger>
                    <TabsTrigger
                      value="fall2025"
                      onClick={() => handleTermChange("fall2025")}
                      className={
                        currentScheduleTerm === "fall2025" ? "bg-primary" : ""
                      }
                    >
                      FA25
                    </TabsTrigger>
                  </TabsList>
                </CardContent>
              </Card>
              <TabsContent value="spring2025">
                <ScheduleBuilderForm onSwitchTab={() => {}} />
              </TabsContent>
              <TabsContent value="summer2025">
                <ScheduleBuilderForm onSwitchTab={() => {}} />
              </TabsContent>
              <TabsContent value="fall2025">
                <ScheduleBuilderForm onSwitchTab={() => {}} />
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
  const { currentScheduleTerm } = useAppSelector((state) => state.schedule);

  const [tabValue, setTabValue] = useState<CourseTerm | "schedule">(
    currentScheduleTerm
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleTermChange = (value: string) => {
    dispatch(scheduleActions.setCurrentScheduleTerm(value as CourseTerm));
    dispatch(scheduleActions.setCurrentScheduleId(undefined));
    navigate("/schedule-builder");
  };

  return (
    <Tabs
      value={tabValue}
      onValueChange={(value) => setTabValue(value as CourseTerm | "schedule")}
      defaultValue={currentScheduleTerm}
    >
      <TabsList className="grid w-full grid-cols-4 dark:bg-gray-900">
        <TabsTrigger
          value="spring2025"
          onClick={() => handleTermChange("spring2025")}
          className={currentScheduleTerm === "spring2025" ? "bg-primary" : ""}
        >
          SP25
        </TabsTrigger>
        <TabsTrigger
          value="summer2025"
          onClick={() => handleTermChange("summer2025")}
          className={currentScheduleTerm === "summer2025" ? "bg-primary" : ""}
        >
          SU25
        </TabsTrigger>
        <TabsTrigger
          value="fall2025"
          onClick={() => handleTermChange("fall2025")}
          className={currentScheduleTerm === "fall2025" ? "bg-primary" : ""}
        >
          FA25
        </TabsTrigger>
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
      </TabsList>
      <TabsContent value="spring2025">
        <ScheduleBuilderForm onSwitchTab={() => setTabValue("schedule")} />
      </TabsContent>
      <TabsContent value="summer2025">
        <ScheduleBuilderForm onSwitchTab={() => setTabValue("schedule")} />
      </TabsContent>
      <TabsContent value="fall2025">
        <ScheduleBuilderForm onSwitchTab={() => setTabValue("schedule")} />
      </TabsContent>
      <TabsContent value="schedule">
        <ScheduleContainer />
        <PaginationFooter />
      </TabsContent>
    </Tabs>
  );
};

export default ScheduleBuilderPage;
