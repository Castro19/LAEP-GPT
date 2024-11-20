import { useEffect, useRef } from "react";
import ChatContainer from "@/components/chat/ChatContainer";
import { viewGPTs } from "../redux/gpt/crudGPT";
import {
  useAppSelector,
  useAppDispatch,
  gptActions,
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

  const gptList = useAppSelector((state) => state.gpt.gptList);
  const hasFetchedGptList = useRef(false);

  useEffect(() => {
    if (hasFetchedGptList.current || gptList.length > 0) return;
    hasFetchedGptList.current = true;

    const fetchGptList = async () => {
      if (userId) {
        try {
          const fetchedGptList = await viewGPTs();
          dispatch(gptActions.initGptList(fetchedGptList.gptList));
        } catch (error) {
          console.error("Error fetching GPT list: ", error);
        }
      }
    };
    fetchGptList();
  }, [userId, dispatch, gptList.length]);

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
