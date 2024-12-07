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
          console.error("Error fetching GPT list: ", error);
        }
      }
    };
    fetchassistantList();
  }, [userId, dispatch, assistantList.length]);

  useEffect(() => {
    const fetchLog = async () => {
      if (chatId) {
        dispatch(messageActions.toggleNewChat(false));
        try {
          const log = await fetchLogById(chatId);
          dispatch(messageActions.setMsgList(log.content));
        } catch (error) {
          console.error("Error fetching log: ", error);
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
