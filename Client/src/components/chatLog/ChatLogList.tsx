import ChatLog from "./ChatLog";
import {
  messageActions,
  layoutActions,
  useAppSelector,
  logActions,
  useAppDispatch,
} from "@/redux";
import { useEffect, useRef } from "react";

const ChatLogList = () => {
  const logList = useAppSelector((state) => state.log.logList);
  const userId = useAppSelector((state) => state.auth.userId);
  const dispatch = useAppDispatch();

  const hasFetchedLogs = useRef(false);

  const { currentChatId, loading, messagesByChatId } = useAppSelector(
    (state) => state.message
  );

  useEffect(() => {
    if (hasFetchedLogs.current || logList.length > 0) return;
    hasFetchedLogs.current = true;
    // Only fetch logs if userId is not null (user is signed in)
    if (userId) {
      dispatch(logActions.fetchLogs());
    }
  }, [dispatch, userId, logList.length]);

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
