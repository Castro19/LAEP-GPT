import { useAppSelector } from "@/redux";
import { CalendarListItem } from "@polylink/shared/types";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import CalendarOptions from "./CalendarOptions";
import { useState } from "react";
const SavedSchedules = () => {
  const { calendarList, primaryCalendarId } = useAppSelector(
    (state) => state.calendar
  );
  return (
    <div>
      <div className="flex flex-col items-start justify-start gap-2">
        {calendarList && calendarList.length > 0 ? (
          calendarList.map((calendar: CalendarListItem) => (
            <ScheduleItem
              key={calendar.id}
              calendar={calendar}
              isPrimary={calendar.id === primaryCalendarId}
            />
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

const ScheduleItem = ({
  calendar,
  isPrimary,
}: {
  calendar: CalendarListItem;
  isPrimary: boolean;
}) => {
  const [name, setName] = useState(calendar.name);
  const [primaryOption, setPrimaryOption] = useState(isPrimary);

  const navigate = useNavigate();

  const handleSelectSchedule = () => {
    navigate(`/calendar/${calendar.id}`);
  };

  return (
    <div className="group flex items-center justify-between px-2 py-2.5 mb-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 w-full">
      {" "}
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
            {new Date(calendar.updatedAt).toLocaleString(undefined, {
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </Button>
      <div
        className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
      >
        <CalendarOptions
          calendar={calendar}
          name={name}
          onNameChange={setName}
          primaryOption={primaryOption}
          onPrimaryChange={setPrimaryOption}
        />
      </div>
    </div>
  );
};

export default SavedSchedules;
