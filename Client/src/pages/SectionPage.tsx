import SectionPageLayout from "@/components/layout/SectionPage/SectionPageLayout";
import SectionFilters from "@/components/section/SectionFilters";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SectionsFilterParams } from "@polylink/shared/types";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { assistantActions, useAppDispatch } from "@/redux";
import { useAppSelector } from "@/redux";
import { environment } from "@/helpers/getEnvironmentVars";

const SectionPage = () => {
  const [selectedFilters, setSelectedFilters] = useState<SectionsFilterParams>(
    {} as SectionsFilterParams
  );
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

  const handleSetSelectedFilters = (
    filter: keyof SectionsFilterParams,
    value: string
  ) => {
    if (filter === "days") {
      const currentDays = selectedFilters.days
        ? selectedFilters.days.split(",")
        : [];
      const updatedDays = currentDays.includes(value)
        ? currentDays.filter((d) => d !== value)
        : [...currentDays, value];
      setSelectedFilters((prevFilters) => ({
        ...prevFilters,
        days: updatedDays.join(","),
      }));
    } else {
      setSelectedFilters((prevFilters) => ({
        ...prevFilters,
        [filter]: value,
      }));
    }
  };
  // You could lift this function up to a parent or call a custom hook
  const handleApplyFilters = () => {
    console.log(selectedFilters);
  };

  return (
    <SidebarProvider>
      <SectionPageLayout>
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 min-h-screen">
          {/* Filter Section */}
          <div className="border border-slate-500 md:col-span-1 row-span-full p-4">
            <Card className="h-full">
              <div className="flex flex-col justify-between h-full py-6">
                {/* Placeholder for SectionFilters */}
                <SectionFilters
                  filters={selectedFilters}
                  handleSetSelectedFilters={handleSetSelectedFilters}
                />
              </div>
            </Card>
          </div>

          {/* Weekly Calendar Section */}
          <div className="border border-slate-500 md:col-span-3 md:row-span-1 p-4">
            <Card className="h-full">
              <div className="flex flex-col justify-center items-center h-full py-6">
                {/* Placeholder for WeeklyCalendar */}
                <div className="text-center text-lg font-bold">
                  Weekly Calendar
                </div>
              </div>
            </Card>
          </div>

          {/* List of Sections */}
          <div className="border border-slate-500 md:col-span-3 md:row-span-2 p-4">
            <Card className="h-full">
              <div className="flex flex-col justify-start h-full py-6">
                {/* Placeholder for List of Sections */}
                <div className="text-center text-lg font-bold">
                  List of Sections
                </div>
              </div>
            </Card>
          </div>
        </div>
      </SectionPageLayout>
    </SidebarProvider>
  );
};

export default SectionPage;
