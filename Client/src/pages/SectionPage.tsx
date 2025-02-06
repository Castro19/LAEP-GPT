import SectionPageLayout from "@/components/layout/SectionPage/SectionPageLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactElement, useEffect, useRef, useState } from "react";
import { assistantActions, useAppDispatch } from "@/redux";
import { useAppSelector } from "@/redux";
import { environment } from "@/helpers/getEnvironmentVars";
import SectionFilters from "@/components/section/filterForm/SectionFilters";
import SectionContainer from "@/components/section/SectionContainer";
import { ChatContainer } from "@/components/chat";
import AnimateWrapper from "@/components/section/AnimateWrapper";
import AdminViewOnly from "@/components/security/AdminViewOnly";
import OuterSidebar from "@/components/layout/OuterIconSidebar";

const SectionPage = () => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.userId);
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

  return (
    <AdminViewOnly>
      <div className="flex">
        <OuterSidebar />
        <SidebarProvider className="dark:bg-slate-900">
          <SectionPageLayout>
            <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-1 gap-4">
              <div className="col-span-1">
                {/* <SectionFilters /> */}
                {currentPanel}
              </div>
              <div className="col-span-2">
                <SectionContainer />
              </div>
            </div>
          </SectionPageLayout>
        </SidebarProvider>
      </div>
    </AdminViewOnly>
  );
};

export default SectionPage;

{
  /* <div className="md:col-span-1 p-4 no-scroll">
<SectionFilters />
</div> */
}
