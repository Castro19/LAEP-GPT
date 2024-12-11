import { useEffect, useRef } from "react";
import ChatContainer from "@/components/chat/ChatContainer";
import {
  useAppSelector,
  useAppDispatch,
  assistantActions,
  messageActions,
} from "@/redux";
import { useParams } from "react-router-dom";
import { fetchLogById } from "@/redux/log/crudLog";
import { SidebarProvider } from "@/components/ui/sidebar";
import ChatPageLayout from "@/components/layout/ChatPage/ChatPageLayout";
import { LogData } from "@polylink/shared/types";
import { environment } from "@/helpers/getEnvironmentVars";

const ChatPage = () => {
  const dispatch = useAppDispatch();

  const { chatId } = useParams();

  const userId = useAppSelector((state) => state.auth.userId);

  const assistantList = useAppSelector(
    (state) => state.assistant.assistantList
  );
  const hasFetchedassistantList = useRef(false);

  useEffect(() => {
    if (hasFetchedassistantList.current || assistantList.length > 0) return;
    hasFetchedassistantList.current = true;

    const fetchassistantList = async () => {
      if (userId) {
        try {
          dispatch(assistantActions.fetchAll());
        } catch (error) {
          if (environment === "dev") {
            console.error("Error fetching GPT list: ", error);
          }
        }
      }
    };
    fetchassistantList();
  }, [assistantList.length, dispatch, userId]);

  useEffect(() => {
    if (assistantList.length > 0) {
      dispatch(assistantActions.setCurrentAssistant(assistantList[0].id));
    }
  }, [assistantList, dispatch]);

  useEffect(() => {
    const fetchLog = async () => {
      if (chatId) {
        dispatch(messageActions.toggleNewChat(false));
        try {
          const log = (await fetchLogById(chatId)) as LogData;
          if (log.content) {
            dispatch(
              messageActions.setMsgList({ chatId, content: log.content })
            );
          }
          dispatch(messageActions.setCurrentChatId(chatId));
          if (log.assistantMongoId) {
            dispatch(
              assistantActions.setCurrentAssistant(log.assistantMongoId)
            );
          }
        } catch (error) {
          if (environment === "dev") {
            console.error("Error fetching log: ", error);
          }
        }
      }
    };
    fetchLog();
  }, [chatId, dispatch]);

  return (
    <SidebarProvider>
      <ChatPageLayout>
        <ChatContainer />
      </ChatPageLayout>
    </SidebarProvider>
  );
};

export default ChatPage;
