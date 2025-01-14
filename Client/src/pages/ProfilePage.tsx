import { flowchartActions, useAppDispatch, useAppSelector } from "@/redux";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WeeklyCalendar from "../components/register/WeeklyCalendar";
import { useUserData } from "@/hooks/useUserData";
// import Terms from "@/components/register/SignInFlow/Terms";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AnimatedModalDemo } from "@/components/layout/CustomModal";
import Interest from "@/components/userProfile/Interest";
import FlowChart from "@/components/flowchart/FlowChart";
import { useEffect, useRef } from "react";
import FlowChartOptions from "@/components/register/SignInFlow/FlowChartOptions";
import { useNavigate } from "react-router-dom";

import SpecialButton from "@/components/ui/specialButton";
import ProfileBio from "@/components/userProfile/ProfileBio";
import AboutMe from "@/components/register/SignInFlow/AboutMe";
import { environment } from "@/helpers/getEnvironmentVars";
import { Interests } from "@/components/register/SignInFlow/Interests";
export const labelStyle = "text-lg self-center";

const yearMapping = (year: string) => {
  switch (year) {
    case "1":
      return "1st Year";
    case "2":
      return "2nd Year";
    case "3":
      return "3rd Year";
    case "4":
      return "4th Year";
    case "5":
      return "5th Year";
    case "6":
      return "6th Year";
    default:
      return "N/A";
  }
};
export function ProfilePage() {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { userType } = useAppSelector((state) => state.auth);
  const { userData } = useAppSelector((state) => state.user);
  const { selections } = useAppSelector((state) => state.flowSelection);
  const { flowchartData, currentFlowchart } = useAppSelector(
    (state) => state.flowchart
  );
  const initialLoadRef = useRef(false);
  const interestDropdownRef = useRef<HTMLDivElement>(null);
  const flowchartOptionsRef = useRef<HTMLDivElement>(null);

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

  const handleSaveToast = () => {
    handleSave();
    toast({
      title: "User Profile Updated",
      description: "Your profile has been updated successfully",
    });
  };

  const handleSaveDegreeInfo = () => {
    if (selections.startingYear && selections.catalog && selections.major) {
      // Change User information in database
      handleSave();
      toast({
        title: "Degree Information Updated",
        description: "Your degree information has been updated successfully.",
      });
    } else {
      toast({
        title: "Please select all fields",
        description: "Select a starting year, catalog, and major",
        variant: "destructive",
      });
    }
  };

  const handleUpdateFlowchart = async () => {
    try {
      await dispatch(
        flowchartActions.updateFlowchart({
          flowchartId: userData.flowchartInformation.flowchartId ?? "",
          flowchartData,
          name: currentFlowchart?.name ?? "",
          primaryOption: true,
        })
      ).unwrap();
      toast({
        title: "Flowchart Saved",
        description: "Your flowchart has been saved successfully.",
      });
    } catch (error) {
      if (environment === "dev") {
        console.error("Failed to update flowchart:", error);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 border-3 min-h-screen">
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
        <div className="flex flex-col gap-4">
          <div className="flex flex-col justify-center items-center">
            <AnimatedModalDemo
              onSave={handleSaveDegreeInfo}
              title="Change Major"
              excludeRefs={[flowchartOptionsRef]}
              disableOutsideClick={true}
              className="w-3/4"
            >
              <FlowChartOptions type="profile" />
            </AnimatedModalDemo>
          </div>
          <SpecialButton
            text="Modify Flowcharts"
            onClick={() => {
              navigate(
                `/flowchart/${userData.flowchartInformation.flowchartId}`
              );
            }}
          />
        </div>
      </GridItemContainer>
      <GridItemContainer>
        <div className="flex flex-col justify-center items-center w-full">
          <Label className="text-2xl font-bold mb-4 border-b pb-4 border-slate-700 block text-center w-full">
            Bio
          </Label>
          <ProfileBio bio={userData?.bio} handleSave={handleSaveToast} />
        </div>
        <div className="flex justify-center items-center mt-8">
          <AnimatedModalDemo
            className="w-3/4"
            onSave={handleSave}
            title="Modify Bio"
          >
            <AboutMe />
          </AnimatedModalDemo>
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
          <AnimatedModalDemo
            onSave={handleSaveToast}
            title="Modify Interests"
            excludeRefs={[interestDropdownRef]}
            disableOutsideClick={true}
            className="w-3/4 max-w-2xl"
          >
            <Interests />
          </AnimatedModalDemo>
        </div>
      </GridItemContainer>
      <div className="border border-slate-500 md:col-span-3 md:row-span-2 p-4">
        <Tabs defaultValue="flowchart">
          <TabsList className="grid w-full grid-cols-2 dark:bg-gray-900">
            <TabsTrigger value="flowchart">Flowchart</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
          </TabsList>
          <TabsContent value="flowchart">
            <Card className="h-full">
              <FlowChart flowchartData={flowchartData} />
              <SpecialButton
                onClick={handleUpdateFlowchart}
                text="Save Flowchart"
              />
            </Card>
          </TabsContent>
          <TabsContent value="availability">
            <Card className="h-full">
              <div className="flex flex-col justify-start h-full py-6">
                <div className="flex flex-col justify-center items-center">
                  <WeeklyCalendar />
                </div>

                <SpecialButton
                  onClick={handleSaveToast}
                  text="Save Availability"
                />
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
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
