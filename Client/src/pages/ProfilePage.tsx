import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, flowchartActions } from "@/redux";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, flowchartActions } from "@/redux";
import { useUserData } from "@/hooks/useUserData";
import { toast } from "@/components/ui/use-toast";
import { environment } from "@/helpers/getEnvironmentVars";


import { GridItemContainer } from "@/components/userProfile/GridItemContainer";
import { SilverLine } from "@/components/userProfile/SilverLine";
import { ProfileHeader } from "@/components/userProfile/ProfileHeader";
import { ProfileBioSection } from "@/components/userProfile/ProfileBioSection";
import { ProfileInterestsSection } from "@/components/userProfile/ProfileInterestsSection";
import { ProfileFlowchartSection } from "@/components/userProfile/ProfileFlowchartSection";
import { ProfileAvailabilitySection } from "@/components/userProfile/ProfileAvailabilitySection";


export function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector((state) => state.user);
  const { selections } = useAppSelector((state) => state.flowSelection);
  const { flowchartData, loading, currentFlowchart } = useAppSelector((state) => state.flowchart);
  const initialLoadRef = useRef(false);

  const { handleSave } = useUserData();

  // Load user's flowchart on first render
  useEffect(() => {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;

    if (userData.flowchartInformation.flowchartId) {
      dispatch(flowchartActions.setFlowchart(userData.flowchartInformation.flowchartId));
    }
  }, [dispatch, userData.flowchartInformation.flowchartId]);

  // Update flowchart data
  useEffect(() => {
    const updateFlowchart = async () => {
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
  }, [flowchartData]);

  const handleSaveToast = () => {
    handleSave();
    toast({
      title: "User Profile Updated",
      description: "Your profile has been updated successfully",
    });
  };

  const handleSaveDegreeInfo = () => {
    if (selections.major || selections.startingYear) {
      handleSave();
      toast({
        title: "Degree Information Updated",
        description: "Your degree information has been updated successfully.",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-auto border-3 min-h-screen overflow-auto">
      {/* Profile Header Section */}
      <GridItemContainer>
        <ProfileHeader handleSaveDegreeInfo={handleSaveDegreeInfo} />
      </GridItemContainer>

      {/* Profile Bio Section */}
      <GridItemContainer>
        <ProfileBioSection handleSaveToast={handleSaveToast} />
      </GridItemContainer>

      {/* Profile Interests Section */}
      <GridItemContainer>
        <ProfileInterestsSection handleSaveToast={handleSaveToast} />
      </GridItemContainer>

      {/* Flowchart and Availability Section */}
      <div className="border border-slate-500 md:col-span-3 md:row-span-auto p-4">
        <ProfileFlowchartSection />
        <SilverLine />
        <ProfileAvailabilitySection handleSaveToast={handleSaveToast} />
      </div>
    </div>
  );
}
