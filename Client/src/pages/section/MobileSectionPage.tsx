import { useState } from "react";

// My Components
import SectionContainer from "@/components/section/layout/SectionContainer";
import SectionForm from "@/components/section/courseFilters/SectionForm";
import MobileSectionPageLayout from "@/components/layout/SectionPage/MobileSectionPageLayout";

// UI Components
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const SectionPageMobile = () => {
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

export default SectionPageMobile;
