import { useAppSelector } from "@/redux";
import { ScheduleListItem } from "@polylink/shared/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ScheduleOptions } from "@/components/scheduleBuilder";
import { useState, useEffect } from "react";
import { GoPin } from "react-icons/go";
import { motion, AnimatePresence } from "framer-motion";
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";
import useDeviceType from "@/hooks/useDeviceType";

const SavedSchedules = ({
  onSwitchTab,
}: {
  onSwitchTab?: (tab: string) => void;
}) => {
  const { scheduleList, primaryScheduleId } = useAppSelector(
    (state) => state.schedule
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.1, // Slight delay to ensure loading state has started fading out
      }}
    >
      <div className="flex flex-col items-start justify-start gap-2">
        <AnimatePresence mode="wait">
          {scheduleList && scheduleList.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-full"
            >
              {scheduleList.map((schedule: ScheduleListItem, index: number) => (
                <motion.div
                  key={schedule.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.1 + index * 0.03,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <ScheduleItem
                    schedule={schedule}
                    isPrimary={schedule.id === primaryScheduleId}
                    onSwitchTab={onSwitchTab}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="p-2 text-gray-500 dark:text-gray-400 text-sm"
            >
              Press the{" "}
              <strong className="text-slate-400 font-semibold">
                Save Schedule
              </strong>{" "}
              button to save your schedule
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const ScheduleItem = ({
  schedule,
  isPrimary,
  onSwitchTab,
}: {
  schedule: ScheduleListItem;
  isPrimary: boolean;
  onSwitchTab?: (tab: string) => void;
}) => {
  const [name, setName] = useState(schedule.name);
  const [primaryOption, setPrimaryOption] = useState(isPrimary);

  const isNarrowScreen = useIsNarrowScreen();
  const deviceType = useDeviceType();
  const navigate = useNavigate();

  const handleSelectSchedule = () => {
    navigate(`/schedule-builder/${schedule.id}`);
    if (isNarrowScreen || deviceType !== "desktop") {
      onSwitchTab?.("schedule");
    }
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
