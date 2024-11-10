import { useEffect, useRef } from "react";
import ChatContainer from "@/components/chat/ChatContainer";
import ChatHeader from "@/components/layout/Header";
import { viewGPTs } from "../redux/gpt/crudGPT";
import { useAppSelector, useAppDispatch, gptActions } from "@/redux";

const ChatPage = () => {
  const dispatch = useAppDispatch();

  const userId = useAppSelector((state) => state.auth.userId);
  const isSidebarVisible = useAppSelector(
    (state) => state.layout.isSidebarVisible
  );

  const hasFetchedGptList = useRef(false);

  useEffect(() => {
    if (hasFetchedGptList.current) return;
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
  }, [userId, dispatch]);

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
