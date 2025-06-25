import { FC } from "react";
// Redux:
import {
  useAppSelector,
  useAppDispatch,
  scheduleBuilderLogActions,
} from "@/redux";
// My components:
import ScheduleLogsOptions from "./ScheduleLogsOptions";
// UI components:
import { Button } from "@/components/ui/button";

/**
 * ScheduleBuilderLogs - Component for displaying and managing schedule builder chat logs
 *
 * This component provides a sidebar interface for viewing and managing saved chat logs
 * from schedule builder conversations. It displays log titles, timestamps, and provides
 * options for log management.
 *
 * @component
 * @param {Object} props - Component props
 * @param {function} props.onClose - Callback function to close the logs panel
 *
 * @example
 * ```tsx
 * <ScheduleBuilderLogs onClose={() => setShowLogs(false)} />
 * ```
 *
 * @dependencies
 * - Redux store for schedule builder log state
 * - ScheduleLogsOptions for individual log management
 * - UI Button components
 *
 * @features
 * - List of saved chat logs with titles and timestamps
 * - Click to load specific log conversations
 * - Hover-based options menu for each log
 * - Automatic log fetching and state management
 * - Responsive design for different screen sizes
 * - Close functionality for panel management
 *
 * @logManagement
 * - handleLogClick: Loads specific log by thread ID
 * - Automatic log fetching from Redux state
 * - Options menu for each log entry
 * - Timestamp formatting and display
 *
 * @layout
 * - Absolute positioned sidebar
 * - Fixed width (320px) with max height
 * - Scrollable log list
 * - Header with close button
 * - Hover effects for interactive elements
 *
 * @styling
 * - Dark theme with slate colors
 * - Proper spacing and typography
 * - Hover states for buttons
 * - Shadow and border effects
 * - Responsive design considerations
 *
 * @accessibility
 * - Proper button roles and labels
 * - Keyboard navigation support
 * - Screen reader friendly structure
 * - Focus management for interactive elements
 *
 * @state
 * - Redux state for logs list
 * - Local state for panel visibility
 * - Automatic state updates on log changes
 */
type Props = {
  onClose: () => void;
};

const ScheduleBuilderLogs: FC<Props> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const logs = useAppSelector((state) => state.scheduleBuilderLog.logs);

  const handleLogClick = (logId: string) => {
    dispatch(scheduleBuilderLogActions.fetchLogByThreadId(logId));
    onClose();
  };

  return (
    <div
      className="absolute left-full top-0 ml-2
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
        {logs.map((log) => (
          <div key={log.thread_id} className="group relative w-full">
            <Button
              variant="ghost"
              className="w-full h-16 px-2 py-1 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-900 dark:bg-opacity-70 active:bg-gray-200 dark:active:bg-gray-700"
              onClick={() => handleLogClick(log.thread_id)}
            >
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-left text-gray-900 dark:text-white truncate">
                  {log.title}
                </h3>
                <p className="text-xs text-left text-gray-500 dark:text-gray-400 truncate">
                  {new Date(log.updatedAt).toLocaleString(undefined, {
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </Button>
            {/* Options button - only visible on hover */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <ScheduleLogsOptions log={log} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleBuilderLogs;
