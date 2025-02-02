import SectionPageLayout from "@/components/layout/SectionPage/SectionPageLayout";
import { SectionFilters } from "@/components/section/SectionFilters";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { assistantActions, useAppDispatch } from "@/redux";
import { useAppSelector } from "@/redux";
import { environment } from "@/helpers/getEnvironmentVars";
import SectionContainer from "@/components/section/SectionContainer";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        <div className="grid grid-cols-1 md:grid-cols-4 min-h-screen overflow-hidden">
          {/* Filter Section (Left Sidebar) */}
          <div className="border border-slate-500 md:col-span-1 p-4">
            <Card className="h-full">
              <ScrollArea className="h-full">
                <div className="flex flex-col justify-between h-full py-6">
                  <SectionFilters />
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Right Column: Calendar & Sections List */}
          <div className="md:col-span-3 p-4 flex flex-col space-y-4">
            {/* Weekly Calendar Section with fixed height */}
            <div className="h-80 border border-slate-500">
              <Card className="h-full">
                <div className="flex flex-col justify-center items-center h-full py-6">
                  <div className="text-center text-lg font-bold">
                    Weekly Calendar
                  </div>
                </div>
              </Card>
            </div>

            {/* List of Sections with flexible height */}
            <div className="flex-1 border border-slate-500 p-4">
              <Card className="h-full">
                <ScrollArea className="h-full">
                  <div className="flex flex-col justify-start h-full py-6">
                    <SectionContainer />
                  </div>
                </ScrollArea>
              </Card>
            </div>
          </div>
        </div>
      </SectionPageLayout>
    </SidebarProvider>
  );
};

export default SectionPage;
