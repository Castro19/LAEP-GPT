import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";

// My Components
import SectionPageLayout from "@/components/layout/ClassSearchPage/SectionPageLayout";
import SectionContainer from "@/components/classSearch/layout/SectionContainer";
import SectionForm from "@/components/classSearch/courseFilters/SectionForm";

// UI Components
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useEffect, useRef, useState } from "react";
import MobileSectionPageLayout from "@/components/layout/ClassSearchPage/MobileSectionPageLayout";
import useDeviceType from "@/hooks/useDeviceType";
import { useUserData } from "@/hooks/useUserData";
import { flowSelectionActions, useAppDispatch } from "@/redux";

const SectionPage = () => {
  const isNarrowScreen = useIsNarrowScreen();
  const deviceType = useDeviceType();
  const dispatch = useAppDispatch();
  const { userData } = useUserData();
  const { major } = userData.flowchartInformation;

  const hasFetchedMajorOptions = useRef(false);
  const hasFetchedConcentrationOptions = useRef(false);

  useEffect(() => {
    if (hasFetchedMajorOptions.current) return;
    hasFetchedMajorOptions.current = true;
    // Only fetch major options once when component mounts
    dispatch(flowSelectionActions.fetchMajorOptions("2022-2026"));
  }, [dispatch]);

  useEffect(() => {
    if (hasFetchedConcentrationOptions.current) return;
    hasFetchedConcentrationOptions.current = true;
    // Only fetch concentration options when major changes
    if (major) {
      dispatch(
        flowSelectionActions.fetchConcentrationOptions({
          catalog: "2022-2026",
          major: major,
        })
      );
    }
  }, [dispatch, major]);

  return (
    <>
      {deviceType !== "desktop" ? (
        <MobileSectionPage />
      ) : (
        <SectionPageLayout>
          {isNarrowScreen ? (
            <SectionMobile />
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-1 gap-4">
                <div className="col-span-1">
                  <SectionForm />
                </div>
                <div className="col-span-2">
                  <SectionContainer />
                </div>
              </div>
            </div>
          )}
        </SectionPageLayout>
      )}
    </>
  );
};

const SectionMobile = () => {
  const [tabValue, setTabValue] = useState("filters");

  return (
    <Tabs
      value={tabValue}
      onValueChange={(value) => setTabValue(value)}
      defaultValue="filters"
    >
      <TabsList className="grid w-full grid-cols-2 dark:bg-gray-900">
        <TabsTrigger value="filters">Filters</TabsTrigger>
        <TabsTrigger value="sections">View Sections</TabsTrigger>
      </TabsList>
      <TabsContent value="filters">
        <SectionForm onSwitchTab={() => setTabValue("sections")} />
      </TabsContent>
      <TabsContent value="sections">
        <SectionContainer />
      </TabsContent>
    </Tabs>
  );
};

const MobileSectionPage = () => {
  const [tabValue, setTabValue] = useState("filters");

  return (
    <MobileSectionPageLayout>
      <Tabs
        value={tabValue}
        onValueChange={(value) => setTabValue(value)}
        defaultValue="filters"
      >
        <TabsList className="grid w-full grid-cols-2 dark:bg-gray-900">
          <TabsTrigger value="filters">Filters</TabsTrigger>
          <TabsTrigger value="sections">View Sections</TabsTrigger>
        </TabsList>
        <TabsContent value="filters">
          <SectionForm onSwitchTab={() => setTabValue("sections")} />
        </TabsContent>
        <TabsContent value="sections">
          <SectionContainer />
        </TabsContent>
      </Tabs>
    </MobileSectionPageLayout>
  );
};

export default SectionPage;
