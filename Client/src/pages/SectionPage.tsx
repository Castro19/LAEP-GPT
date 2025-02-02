import SectionPageLayout from "@/components/layout/SectionPage/SectionPageLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useRef } from "react";

import { assistantActions, useAppDispatch } from "@/redux";
import { useAppSelector } from "@/redux";
import { environment } from "@/helpers/getEnvironmentVars";
import ResizableSectionLayout from "@/components/section/ResizableSectionLayout";
const SectionPage = () => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.userId);
  const assistantList = useAppSelector(
    (state) => state.assistant.assistantList
  );
  const hasFetchedassistantList = useRef(false);

  useEffect(() => {
    if (hasFetchedassistantList.current || assistantList.length > 0) return;
    hasFetchedassistantList.current = true;

    const fetchassistantList = async () => {
      if (userId) {
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
    if (assistantList.length > 0) {
      dispatch(assistantActions.setCurrentAssistant(assistantList[0].id));
    }
  }, [assistantList, dispatch]);

  return (
    <SidebarProvider>
      <SectionPageLayout>
        <ResizableSectionLayout />
      </SectionPageLayout>
    </SidebarProvider>
  );
};

export default SectionPage;

{
  /* <div className="md:col-span-1 p-4 no-scroll">
<SectionFilters />
</div> */
}
