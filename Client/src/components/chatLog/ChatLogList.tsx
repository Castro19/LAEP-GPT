/**
 * @component ChatLogList
 * @description List of chat logs displaying recent conversations.
 * Manages the display and selection of chat history.
 *
 * @props
 * @prop {Array<ChatLog>} logs - Array of chat logs
 * @prop {string} currentLogId - ID of currently selected chat
 * @prop {Function} onSelectLog - Function to select a chat
 *
 * @features
 * - Chat log listing
 * - Chat selection
 * - Empty state handling
 * - Scroll management
 *
 * @dependencies
 * - ChatLog: For individual chat items
 * - Redux: For log management
 *
 * @behavior
 * - Renders chat list
 * - Handles selection
 * - Manages empty state
 * - Updates current chat
 *
 * @related
 * Components: ChatLog.tsx
 * - For individual chat items
 * Redux: Client/src/redux/log/logSlice.ts
 * - For log state management
 */

import ChatLog from "./ChatLog";
import {
  messageActions,
  layoutActions,
  useAppSelector,
  useAppDispatch,
} from "@/redux";

const ChatLogList = () => {
  const logList = useAppSelector((state) => state.log.logList);

  const dispatch = useAppDispatch();

  const { currentChatId, loading, messagesByChatId } = useAppSelector(
    (state) => state.message
  );

  // Handler for selecting a log to view
  const handleSelectLog = (logId: string) => {
    if (currentChatId) {
      if (loading[currentChatId]) {
        // Get the last user message id. It will be the last or 2nd to last message in the array. it will always be the the last message of the array with the type "user"
        const lastMessages = messagesByChatId[currentChatId].content.slice(-2);
        const userMessageId = lastMessages.find(
          (message) => message.sender === "user"
        )?.id;
        if (userMessageId) {
          dispatch(
            messageActions.cancelBotResponse({
              userMessageId: userMessageId,
              chatId: currentChatId,
            })
          );
        }
      }
    }
    const chosenLog = logList.find((item) => item.logId === logId);
    if (chosenLog) {
      // Set the current chat id
      dispatch(messageActions.setCurrentChatId(logId));
      dispatch(messageActions.toggleNewChat(false));

      dispatch(layoutActions.toggleSidebar(false)); // close slidebar
    }
  };

  return (
    <>
      {logList.length > 0 ? (
        logList.map((log) => (
          <ChatLog key={log.logId} log={log} onSelectLog={handleSelectLog} />
        ))
      ) : (
        <div>No chat logs available</div>
      )}
    </>
  );
};

export default ChatLogList;
