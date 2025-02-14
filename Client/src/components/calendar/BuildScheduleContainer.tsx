import AnimateWrapper from "../section/AnimateWrapper";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createOrUpdateCalendarAsync } from "@/redux/calendar/calendarSlice";
import { environment } from "@/helpers/getEnvironmentVars";
import { useAppDispatch, useAppSelector } from "@/redux";
import useMobile from "@/hooks/use-mobile";

const BuildScheduleContainer = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => {
  const isMobile = useMobile();
  const dispatch = useAppDispatch();
  const { page, calendars, loading } = useAppSelector(
    (state) => state.calendar
  );

  const onSaveSchedule = () => {
    try {
      if (environment === "dev") {
        console.log("Saving schedule...");
      }
      const sections = calendars[page - 1]?.sections;
      if (sections) {
        dispatch(createOrUpdateCalendarAsync(sections));
      }
    } catch (error) {
      if (environment === "dev") {
        console.error("Error saving schedule:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AnimateWrapper>
      <div className="flex flex-col h-full">
        <Card
          className={`flex flex-col border-0 shadow-lg no-scroll flex-1 ${
            isMobile ? "max-h-[70%]" : "max-h-[75%]"
          }`}
        >
          <div className="overflow-auto flex-1 no-scroll">
            <ScrollArea className="h-full min-w-full mb-4">
              <div className="px-6 space-y-4 pb-4">{children}</div>
            </ScrollArea>
          </div>
        </Card>
        {/* Divider */}
        <div className="border-t border-gray-200 p-4" />
        {/* Sticky footer with Reset and Apply */}
        <div className="sticky bottom-0 mx-4 bg-background/95 backdrop-blur flex gap-2 shadow-lg mb-8">
          {/* Apply Filters button */}
          <Button type="submit" className="w-full shadow-lg" onClick={onClick}>
            Build Schedule
          </Button>
          <Button
            onClick={onSaveSchedule}
            variant="outline"
            className="w-full shadow-lg"
          >
            Save Schedule
          </Button>
        </div>
      </div>
    </AnimateWrapper>
  );
};

export default BuildScheduleContainer;
