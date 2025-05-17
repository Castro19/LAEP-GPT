import { FC } from "react";
import { Button } from "@/components/ui/button";
import {
  useAppSelector,
  useAppDispatch,
  scheduleBuilderLogActions,
} from "@/redux";

type Props = {
  onClose: () => void;
};

const ScheduleBuilderLogs: FC<Props> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const logs = useAppSelector((state) => state.scheduleBuilderLog.logs);

  const handleLogClick = (logId: string) => {
    dispatch(scheduleBuilderLogActions.fetchLogByThreadId(logId));
  };

  return (
    <div
      className="absolute left-full top-0 ml-2   /* ← key changes */
                w-80 max-h-[80vh] bg-slate-800 text-white z-50
                shadow-xl border border-slate-700 rounded-xl flex flex-col"
    >
      {/* header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700">
        <span className="text-sm font-semibold">Schedule Builder Logs</span>
        <Button size="icon" variant="ghost" onClick={onClose}>
          ×
        </Button>
      </div>

      {/* log list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {logs.map((log, i) => (
          <Button
            variant="ghost"
            className="w-full justify-start items-start text-left"
            onClick={() => handleLogClick(log.thread_id)}
          >
            <div key={i} className="min-w-0 flex-1 text-left">
              <h3 className="font-medium text-gray-900 dark:text-white truncate text-left">
                {log.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate text-left">
                {new Date(log.updatedAt).toLocaleString(undefined, {
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ScheduleBuilderLogs;
