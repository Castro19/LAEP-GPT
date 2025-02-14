import SectionPageLayout from "@/components/layout/SectionPage/SectionPageLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactElement, useEffect, useRef, useState } from "react";
import {
  assistantActions,
  flowSelectionActions,
  useAppDispatch,
} from "@/redux";
import { useAppSelector } from "@/redux";
import { environment } from "@/helpers/getEnvironmentVars";
import SectionFilters from "@/components/section/filterForm/SectionFilters";
import SectionContainer from "@/components/section/SectionContainer";
import { ChatContainer } from "@/components/chat";
import AnimateWrapper from "@/components/section/AnimateWrapper";
import OuterSidebar from "@/components/layout/OuterIconSidebar";
import { useUserData } from "@/hooks/useUserData";
import useMobile from "@/hooks/use-mobile";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
const SectionPage = () => {
  const isMobile = useMobile();

  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.userId);
  const { userData } = useUserData();
  const { major } = userData.flowchartInformation;
  const assistantList = useAppSelector(
    (state) => state.assistant.assistantList
  );
  const currentChoice = useAppSelector(
    (state) => state.panelLayout.currentChoice
  );

  const [currentPanel, setCurrentPanel] = useState<ReactElement | null>(
    <SectionFilters />
  );

  const hasFetchedassistantList = useRef(false);

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

  useEffect(() => {
    if (currentChoice === "chat") {
      setCurrentPanel(<ChatContainer />);
    } else if (currentChoice === "reviews") {
      setCurrentPanel(
        <AnimateWrapper>
          <div>
            <h1>Reviews</h1>
          </div>
        </AnimateWrapper>
      );
    } else if (currentChoice === "calendar") {
      setCurrentPanel(
        <AnimateWrapper>
          <div>
            <h1>Calendar</h1>
          </div>
        </AnimateWrapper>
      );
    } else if (currentChoice === "filters") {
      setCurrentPanel(
        <AnimateWrapper>
          <SectionFilters />
        </AnimateWrapper>
      );
    }
  }, [currentChoice, dispatch]);

  useEffect(() => {
    dispatch(flowSelectionActions.fetchMajorOptions("2022-2026"));
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
    <div className={`flex ${isMobile ? "" : ""}`}>
      {isMobile ? null : <OuterSidebar />}
      <SidebarProvider className="dark:bg-slate-900">
        <SectionPageLayout>
          {isMobile ? (
            <Tabs defaultValue="filters">
              <TabsList className="grid w-full grid-cols-2 dark:bg-gray-900 mt-16">
                <TabsTrigger value="filters">Filters</TabsTrigger>
                <TabsTrigger value="sections">View Sections</TabsTrigger>
              </TabsList>
              <TabsContent value="filters">{currentPanel}</TabsContent>
              <TabsContent value="sections">
                <SectionContainer />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-1 gap-4">
              <div className="col-span-1">
                {/* <SectionFilters /> */}
                {currentPanel}
              </div>
              <div className="col-span-2">
                <SectionContainer />
              </div>
            </div>
          )}
        </SectionPageLayout>
      </SidebarProvider>
    </div>
  );
};

export default SectionPage;

{
  /* <div className="md:col-span-1 p-4 no-scroll">
<SectionFilters />
</div> */
}
