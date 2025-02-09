import WeeklyCalendar from "./WeeklyCalendar";
import { useAppSelector } from "@/redux";
const CalendarContainer = () => {
  const { selectedSections } = useAppSelector(
    (state) => state.sectionSelection
  );
  if (selectedSections.length === 0 || !Array.isArray(selectedSections)) {
    return <div>No sections chosen</div>;
  }
  return (
    <div className="flex flex-col gap-4 w-full min-h-screen overflow-hidden no-scroll pb-12">
      <div className="overflow-auto flex-1 no-scroll">
        <WeeklyCalendar sections={selectedSections} />
        {/* Could be footer */}
        {/* <PaginationFooter /> */}
      </div>
    </div>
  );
};

export default CalendarContainer;
