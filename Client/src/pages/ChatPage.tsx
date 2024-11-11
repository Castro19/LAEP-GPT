import { useEffect, useRef } from "react";
import ChatContainer from "@/components/chat/ChatContainer";
import ChatHeader from "@/components/layout/Header";
import { viewGPTs } from "../redux/gpt/crudGPT";
import {
  useAppSelector,
  useAppDispatch,
  gptActions,
  messageActions,
} from "@/redux";
import { useParams } from "react-router-dom";
import { fetchLogById } from "@/redux/log/crudLog";

const ChatPage = () => {
  const dispatch = useAppDispatch();

  const { chatId } = useParams();

  const userId = useAppSelector((state) => state.auth.userId);
  const isSidebarVisible = useAppSelector(
    (state) => state.layout.isSidebarVisible
  );
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
    <div
      className={`bg-slate-800 text-white min-h-screen flex flex-col transition-all duration-300 no-scroll ${
        isSidebarVisible ? "ml-64" : ""
      }`}
    >
      <ChatHeader />
      <div className="flex-1">
        <ChatContainer />
      </div>
    </div>
  );
};

export default ChatPage;
