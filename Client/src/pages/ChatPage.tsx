import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ChatContainer from "@/components/chat/ChatContainer";
import ChatHeader from "@/components/layout/Header";
import { viewGPTs } from "../redux/gpt/crudGPT";
import { useAppSelector, useAppDispatch, gptActions } from "@/redux";

const ChatPage = () => {
  const { chatId } = useParams();
  const dispatch = useAppDispatch();

  const userId = useAppSelector((state) => state.auth.userId);
  const isSidebarVisible = useAppSelector(
    (state) => state.layout.isSidebarVisible
  );

  useEffect(() => {
    const fetchGptList = async () => {
      if (userId) {
        try {
          const fetchedGptList = await viewGPTs(userId);
          console.log("FGL: ", fetchedGptList.gptList);
          dispatch(gptActions.initGptList(fetchedGptList.gptList));
          console.log("GPT LIST FETCHED: ", fetchedGptList);
        } catch (error) {
          console.error("Error fetching GPT list: ", error);
        }
      }
    };
    fetchGptList();
  }, [userId, dispatch]);

  console.log("Chat id in page: ", chatId);

  return (
    <div
      className={`dark:bg-gray-800 dark:text-white min-h-screen flex flex-col transition-all duration-300 no-scroll ${
        isSidebarVisible ? "ml-64" : ""
      }`}
    >
      <ChatHeader />
      <div className="flex-1">
        <ChatContainer />
      </div>{" "}
    </div>
  );
};

export default ChatPage;
