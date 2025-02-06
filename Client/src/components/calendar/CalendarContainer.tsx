import WeeklyCalendar from "./WeeklyCalendar";

const CalendarContainer = () => {
  return (
    <div className="flex flex-col gap-4 w-full min-h-screen overflow-hidden no-scroll pb-12">
      <div className="overflow-auto flex-1 no-scroll">
        <WeeklyCalendar />
        {/* Could be footer */}
        {/* <PaginationFooter /> */}
      </div>
    </div>
  );
};

export default CalendarContainer;
