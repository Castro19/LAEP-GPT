import {
  scheduleActions,
  flowchartActions,
  useAppDispatch,
  useAppSelector,
} from "@/redux";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserData } from "@/hooks/useUserData";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import CustomModal from "@/components/ui/CustomModal";
import Interest from "@/components/userProfile/Interest";
import { Flowchart } from "@/components/flowchart";
import { useEffect, useRef } from "react";
import ProfileBio from "@/components/userProfile/ProfileBio";
import AboutMe from "@/components/register/SignInFlow/AboutMe";
import { Interests } from "@/components/register/SignInFlow/Interests";
import BasicInformation from "@/components/register/SignInFlow/BasicInformation";
import ProfileEmptyState from "@/components/userProfile/ProfileEmptyState";
import { environment } from "@/helpers/getEnvironmentVars";
import { WeeklySchedule } from "@/components/scheduleBuilder";
import { HiOutlineAcademicCap, HiOutlineCalendar } from "react-icons/hi2";
import ProfilePageLayout from "@/components/layout/ProfilePage/ProfilePageLayout";

export const labelStyle = "text-lg self-center";

const yearMapping = (year: string) => {
  switch (year) {
    case "freshman":
      return "Freshman";
    case "sophomore":
      return "Sophomore";
    case "junior":
      return "Junior";
    case "senior":
      return "Senior";
    case "graduate":
      return "Graduate";
    case "incoming-freshman":
      return "Incoming Freshman";
    case "incoming-transfer":
      return "Incoming Transfer";
    default:
      return "";
  }
};

const flowchartEmptyState = {
  title: "No Flowchart Found",
  description:
    "Create your academic plan to visualize your path to graduation and track your progress.",
  icon: <HiOutlineAcademicCap className="text-slate-300" size={48} />,
};

const weeklyScheduleEmptyState = {
  title: "No Schedule Found",
  description:
    "Create a schedule to view your weekly schedule for Spring 2025!",
  icon: <HiOutlineCalendar className="text-slate-300" size={48} />,
};

function ProfilePage() {
  const dispatch = useAppDispatch();
  const { userType } = useAppSelector((state) => state.auth);
  const { userData } = useAppSelector((state) => state.user);
  const { selections } = useAppSelector((state) => state.flowSelection);
  const { flowchartData, loading, currentFlowchart } = useAppSelector(
    (state) => state.flowchart
  );
  const { currentSchedule, primaryScheduleId, currentScheduleTerm } =
    useAppSelector((state) => state.schedule);

  const initialLoadRef = useRef(false);
  const interestDropdownRef = useRef<HTMLDivElement>(null);
  const flowchartOptionsRef = useRef<HTMLDivElement>(null);
  const schedulesFetchedRef = useRef(false);
  const previousFlowchartDataRef = useRef(flowchartData);

  const { handleSave } = useUserData();

  useEffect(() => {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;

    if (userData.flowchartInformation.flowchartId) {
      dispatch(
        flowchartActions.setFlowchart(userData.flowchartInformation.flowchartId)
      );
    }
  }, [dispatch, userData.flowchartInformation.flowchartId]);

  useEffect(() => {
    const updateFlowchart = async () => {
      if (
        initialLoadRef.current &&
        JSON.stringify(previousFlowchartDataRef.current) ===
          JSON.stringify(flowchartData)
      ) {
        return;
      }

      previousFlowchartDataRef.current = flowchartData;

      try {
        if (
          userData.flowchartInformation.flowchartId &&
          !loading.fetchFlowchartData &&
          !loading.updateFlowchart &&
          !loading.deleteFlowchart &&
          !loading.setFlowchart &&
          currentFlowchart
        ) {
          await dispatch(
            flowchartActions.updateFlowchart({
              flowchartId: userData.flowchartInformation.flowchartId ?? "",
              flowchartData,
              name: currentFlowchart?.name ?? "",
              primaryOption: currentFlowchart?.primaryOption ?? false,
            })
          ).unwrap();
        }
      } catch (error) {
        if (environment === "dev") {
          console.error("Failed to update flowchart:", error);
        }
      }
    };
    updateFlowchart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowchartData]);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (schedulesFetchedRef.current) return;
      schedulesFetchedRef.current = true;

      await dispatch(scheduleActions.fetchSchedulesAsync(currentScheduleTerm));
    };

    fetchSchedules();
  }, [dispatch]);

  useEffect(() => {
    if (primaryScheduleId) {
      dispatch(scheduleActions.getScheduleByIdAsync(primaryScheduleId));
    }
  }, [primaryScheduleId, dispatch]);

  const handleSaveToast = () => {
    handleSave();
    toast({
      title: "User Profile Updated",
      description: "Your profile has been updated successfully",
    });
  };

  const handleSaveDegreeInfo = () => {
    if (selections.major || selections.startingYear) {
      // Change User information in database
      handleSave();
      toast({
        title: "Degree Information Updated",
        description: "Your degree information has been updated successfully.",
      });
    }
  };

  return (
    <ProfilePageLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-auto border-3 min-h-screen overflow-auto">
        <GridItemContainer>
          <CardContent>
            <div className="flex flex-col justify-around items-center my-2">
              <Avatar className="w-32 h-32 mb-4">
                <AvatarFallback className="bg-slate-300">
                  {userData?.name?.charAt(0) || "N/A"}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-3xl font-bold text-center my-2">
                {userData?.name || "N/A"}
              </h3>
              <p className="text-lg text-center">{userData?.email || "N/A"}</p>
              <p className="text-lg text-center mt-2">
                {yearMapping(userData?.year || "N/A")}{" "}
                {userData?.flowchartInformation.major || ""}{" "}
                {userType || "Student"}
              </p>
              {!userData?.flowchartInformation.major && (
                <p className="text-lg text-center mt-2">
                  Please update your major to to create a flowchart
                </p>
              )}
            </div>
            <SilverLine />
          </CardContent>
          <div className="flex flex-col items-center ">
            <CustomModal
              onSave={handleSaveDegreeInfo}
              title="Change Major"
              excludeRefs={[flowchartOptionsRef]}
              disableOutsideClick={true}
              className="w-3/4"
            >
              <BasicInformation />
            </CustomModal>
          </div>
        </GridItemContainer>
        <GridItemContainer>
          <div className="flex flex-col items-center justify-between h-full">
            <div className="flex flex-col  w-full">
              <Label className="text-2xl font-bold mb-4 block text-center w-full">
                Bio
              </Label>
              <ProfileBio bio={userData?.bio} handleSave={handleSaveToast} />
            </div>
            <div className="w-3/4">
              <CustomModal onSave={handleSave} title="Modify Bio">
                <AboutMe />
              </CustomModal>
            </div>
          </div>
        </GridItemContainer>
        <GridItemContainer>
          <div className="flex flex-col justify-center items-center gap-8">
            {/* Interest Areas Section */}
            {userData.interestAreas.length > 0 && (
              <div className="w-full max-w-2xl hadow-sm">
                <Label className="text-2xl font-bold mb-4 border-b pb-4 border-slate-700 block text-center">
                  Interests
                </Label>
                <Interest
                  interestAreas={
                    userData.interestAreas.filter(
                      (interest) => interest !== "Other"
                    ) ?? []
                  }
                />
              </div>
            )}

            {/* Preferred Activities Section */}
            {userData.preferredActivities.length > 0 && (
              <div className="w-full max-w-2xl p-6 shadow-sm">
                <Label className="text-2xl font-bold mb-4 border-b pb-4 border-slate-700 block text-center">
                  Preferred Activities
                </Label>
                <Interest
                  interestAreas={
                    userData.preferredActivities.filter(
                      (activity) => activity !== "Other"
                    ) ?? []
                  }
                />
              </div>
            )}

            {/* Goals Section */}
            {userData.goals.length > 0 && (
              <div className="w-full max-w-2xl p-6  shadow-sm">
                <Label className="text-2xl font-bold mb-4 border-b pb-4 border-slate-700 block text-center">
                  Goals
                </Label>
                <Interest
                  interestAreas={
                    userData.goals.filter((goal) => goal !== "Other") ?? []
                  }
                />
              </div>
            )}
          </div>

          {/* Edit Button Section */}
          <div className="flex justify-center items-center mt-8">
            <CustomModal
              onSave={handleSaveToast}
              title="Modify Interests"
              excludeRefs={[interestDropdownRef]}
              disableOutsideClick={true}
              className="w-3/4 max-w-2xl"
            >
              <Interests />
            </CustomModal>
          </div>
        </GridItemContainer>
        <div className="border border-slate-500 md:col-span-3 md:row-span-auto p-4">
          <Tabs defaultValue="flowchart">
            <TabsList className="grid w-full grid-cols-2 dark:bg-gray-900">
              <TabsTrigger value="flowchart">Flowchart</TabsTrigger>
              <TabsTrigger value="weekly-schedule">Weekly Schedule</TabsTrigger>
            </TabsList>
            <TabsContent value="flowchart">
              {flowchartData ? (
                <Card className="h-full">
                  <div className="flex flex-col w-full gap-4 mb-2">
                    <Flowchart flowchartData={flowchartData} />
                  </div>
                </Card>
              ) : (
                <ProfileEmptyState
                  title={flowchartEmptyState.title}
                  description={flowchartEmptyState.description}
                  icon={flowchartEmptyState.icon}
                  type="flowchart"
                />
              )}
            </TabsContent>
            <TabsContent value="weekly-schedule">
              {currentSchedule ? (
                <WeeklySchedule
                  sections={currentSchedule.sections}
                  height="100vh"
                  isProfilePage={true}
                />
              ) : (
                <div className="flex flex-col justify-center items-center">
                  <ProfileEmptyState
                    title={weeklyScheduleEmptyState.title}
                    description={weeklyScheduleEmptyState.description}
                    icon={weeklyScheduleEmptyState.icon}
                    type="schedule-builder"
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProfilePageLayout>
  );
}

const SilverLine = () => (
  <div className="my-4">
    {/* Silver Border */}
    <div className="border border-slate-700"></div>
  </div>
);

const GridItemContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="border border-slate-500 md:col-span-1 p-4">
    <Card className="h-full">
      <div className="flex flex-col justify-between h-full py-6">
        {children}
      </div>
    </Card>
  </div>
);

export default ProfilePage;
