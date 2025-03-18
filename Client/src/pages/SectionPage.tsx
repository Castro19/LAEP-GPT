import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";

// My Components
import SectionPageLayout from "@/components/layout/SectionPage/SectionPageLayout";
import SectionContainer from "@/components/section/layout/SectionContainer";
import SectionForm from "@/components/section/courseFilters/SectionForm";

// UI Components
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import MobileSectionPageLayout from "@/components/layout/SectionPage/MobileSectionPageLayout";
import useDeviceType from "@/hooks/useDeviceType";

const SectionPage = () => {
  const isNarrowScreen = useIsNarrowScreen();
  const deviceType = useDeviceType();

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
