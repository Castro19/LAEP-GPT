import React, { useState } from "react";
// Redux:
import { useAppDispatch, scheduleBuilderLogActions } from "@/redux";
// My components:
import {
  ScheduleBuilderLogs,
  SBNewChat,
} from "@/components/scheduleBuilder/aiChat";
// UI components:
import { Button } from "@/components/ui/button";
// Icons
import { IoMdChatboxes } from "react-icons/io";

const ScheduleBuilderAIChatHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const [showLogs, setShowLogs] = useState(false);

  const onShowScheduleBuilderLogs = () => {
    if (showLogs) {
      setShowLogs(false);
    } else {
      // fetch logs from database
      dispatch(scheduleBuilderLogActions.fetchAllLogs());
      setShowLogs(true);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2 h-full">
      <div className="relative">
        <Button
          variant="ghost"
          onClick={onShowScheduleBuilderLogs}
          aria-label="Show schedule-builder logs"
        >
          <IoMdChatboxes className="w-5 h-5" />
        </Button>
        {showLogs && (
          <ScheduleBuilderLogs onClose={onShowScheduleBuilderLogs} />
        )}
      </div>
      <SBNewChat />
    </div>
  );
};

export default ScheduleBuilderAIChatHeader;
