import useMobile from "@/hooks/use-mobile";

// My Components
import SectionPageLayout from "@/components/layout/SectionPage/SectionPageLayout";
import SectionContainer from "@/components/section/layout/SectionContainer";
import SectionForm from "@/components/section/courseFilters/SectionForm";

// UI Components
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const SectionPage = () => {
  const isMobile = useMobile();

  return (
    <SectionPageLayout>
      {isMobile ? (
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
  );
};

const SectionMobile = () => {
  return (
    <Tabs defaultValue="filters">
      <TabsList className="grid w-full grid-cols-2 dark:bg-gray-900">
        <TabsTrigger value="filters">Filters</TabsTrigger>
        <TabsTrigger value="sections">View Sections</TabsTrigger>
      </TabsList>
      <TabsContent value="filters">
        <SectionForm />
      </TabsContent>
      <TabsContent value="sections">
        <SectionContainer />
      </TabsContent>
    </Tabs>
  );
};

export default SectionPage;
