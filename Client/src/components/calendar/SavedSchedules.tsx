import { useAppSelector } from "@/redux";
import { CalendarListItem } from "@polylink/shared/types";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const SavedSchedules = () => {
  const { calendarList } = useAppSelector((state) => state.calendar);
  return (
    <div>
      <div className="flex flex-col items-start justify-start gap-2">
        {calendarList && calendarList.length > 0 ? (
          calendarList.map((calendar: CalendarListItem) => (
            <ScheduleItem key={calendar.id} calendar={calendar} />
          ))
        ) : (
          <div className="p-2 text-gray-500 dark:text-gray-400 text-sm">
            No schedules available
          </div>
        )}
      </div>
    </div>
  );
};

const ScheduleItem = ({ calendar }: { calendar: CalendarListItem }) => {
  const navigate = useNavigate();

  const handleSelectSchedule = () => {
    navigate(`/calendar/${calendar.id}`);
  };

  return (
    <Button
      onClick={handleSelectSchedule}
      className={`group w-full p-2 rounded-md`}
      variant="ghost"
    >
      <div className="flex-1 min-w-0 flex flex-col items-start justify-start gap-1 p-2">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {calendar.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Created: {new Date(calendar.updatedAt).toLocaleDateString()}
        </p>
      </div>
      <div
        className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
      ></div>
    </Button>
  );
};

export default SavedSchedules;
