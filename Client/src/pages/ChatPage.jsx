import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import ChatContainer from "@/components/chat/ChatContainer";
import ChatHeader from "@/components/layout/Header";
import { viewGPTs } from "../redux/gpt/crudGPT";
import { useSelector, useDispatch } from "react-redux";

import { initGptList } from "../redux/gpt/gptSlice";
import { useAuth } from "../contexts/authContext";

const ChatPage = () => {
  const { chatId } = useParams();
  const { userId } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchGptList = async () => {
      if (userId) {
        try {
          const fetchedGptList = await viewGPTs(userId);
          console.log("FGL: ", fetchedGptList.gptList);
          dispatch(initGptList(fetchedGptList.gptList));
          console.log("GPT LIST FETCHED: ", fetchedGptList);
        } catch (error) {
          console.error("Error fetching GPT list: ", error);
        }
      }
    };

    fetchGptList();
  }, [userId, dispatch]);

  console.log("Chat id in page: ", chatId);
  const isSidebarVisible = useSelector(
    (state) => state.layout.isSidebarVisible
  );

  return (
    <div
      className={`dark:bg-gray-800 dark:text-white min-h-screen p-4 transition-all duration-300 ${
        isSidebarVisible ? "ml-64" : ""
      }`}
    >
      <ChatHeader />
      <ChatContainer />
    </div>
  );
};

export default ChatPage;
