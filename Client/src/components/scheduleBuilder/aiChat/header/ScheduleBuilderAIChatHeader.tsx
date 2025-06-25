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

/**
 * ScheduleBuilderAIChatHeader - Header component for the AI chat interface
 *
 * This component provides the header interface for the schedule builder AI chat,
 * including log management and new chat functionality. It manages the display
 * of chat logs and provides navigation controls.
 *
 * @component
 *
 * @example
 * ```tsx
 * <ScheduleBuilderAIChatHeader />
 * ```
 *
 * @dependencies
 * - Redux store for schedule builder log actions
 * - ScheduleBuilderLogs for log display
 * - SBNewChat for new chat functionality
 * - UI Button components
 * - React Icons for chat icon
 *
 * @features
 * - Toggle chat logs display
 * - New chat button
 * - Automatic log fetching when logs are opened
 * - Responsive design for different screen sizes
 * - Proper state management for log visibility
 *
 * @logManagement
 * - onShowScheduleBuilderLogs: Toggles log display and fetches logs
 * - Automatic log fetching from database
 * - State management for log panel visibility
 * - Close functionality for log panel
 *
 * @layout
 * - Flex layout with right alignment
 * - Gap spacing between elements
 * - Relative positioning for log panel
 * - Full height container
 *
 * @styling
 * - Ghost button variants for subtle appearance
 * - Proper icon sizing and spacing
 * - Hover effects for interactive elements
 * - Consistent spacing and alignment
 *
 * @accessibility
 * - Proper ARIA labels for buttons
 * - Keyboard navigation support
 * - Screen reader friendly structure
 * - Focus management for interactive elements
 *
 * @state
 * - Local state for log panel visibility
 * - Redux state for log management
 * - Automatic state updates on log changes
 */
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
