import { useAppSelector } from "@/redux";
import { ScheduleListItem } from "@polylink/shared/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ScheduleOptions } from "@/components/scheduleBuilder";
import { useState, useEffect } from "react";
import { GoPin } from "react-icons/go";

const SavedSchedules = () => {
  const { scheduleList, primaryScheduleId } = useAppSelector(
    (state) => state.schedule
  );
  return (
    <div>
      <div className="flex flex-col items-start justify-start gap-2">
        {scheduleList && scheduleList.length > 0 ? (
          scheduleList.map((schedule: ScheduleListItem) => (
            <ScheduleItem
              key={schedule.id}
              schedule={schedule}
              isPrimary={schedule.id === primaryScheduleId}
            />
          ))
        ) : (
          <div className="p-2 text-gray-500 dark:text-gray-400 text-sm">
            Press the{" "}
            <strong className="text-slate-400 font-semibold">
              Save Schedule
            </strong>{" "}
            button to save your schedule
          </div>
        )}
      </div>
    </div>
  );
};

const ScheduleItem = ({
  schedule,
  isPrimary,
}: {
  schedule: ScheduleListItem;
  isPrimary: boolean;
}) => {
  const [name, setName] = useState(schedule.name);
  const [primaryOption, setPrimaryOption] = useState(isPrimary);

  const navigate = useNavigate();

  const handleSelectSchedule = () => {
    navigate(`/schedule-builder/${schedule.id}`);
  };

  useEffect(() => {
    if (isPrimary) {
      setPrimaryOption(true);
    }
  }, [isPrimary]);

  return (
    <div className="group flex items-center justify-between px-2 py-2.5 mb-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 w-full border-b border-gray-200 dark:border-gray-700">
      <Button
        onClick={handleSelectSchedule}
        className={`group w-full p-2 rounded-md`}
        variant="ghost"
      >
        {isPrimary && <GoPin className=" dark:text-red-500 mr-1" size={16} />}

        <div className="flex-1 min-w-0 flex flex-col items-start justify-start gap-1 p-2">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {schedule.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(schedule.updatedAt).toLocaleString(undefined, {
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
        <ScheduleOptions
          schedule={schedule}
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
