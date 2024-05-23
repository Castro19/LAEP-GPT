import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
// User Auth Context
import { useAuth } from "@/contexts/authContext";
// React Redux
import { useSelector, useDispatch } from "react-redux";
import {
  toggleNewChat,
  setCurrentChatId,
} from "../../redux/layout/layoutSlice";
import { fetchBotResponse, clearError } from "../../redux/chat/messageSlice";
import { addLog, updateLog } from "../../redux/log/logSlice";
// Helpers
import {
  adjustTextareaHeight,
  resetInputAndScrollToBottom,
} from "./helpers/formatHelper";
import { v4 as uuidv4 } from "uuid";

const ChatInput = ({ messagesContainerRef }) => {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [isSending, setIsSending] = useState(false);

  const { currentUser, userId } = useAuth();
  const textareaRef = useRef(null);

  const dispatch = useDispatch();
  const currentModel = useSelector((state) => state.gpt.currentModel);
  const isNewChat = useSelector((state) => state.layout.isNewChat);
  const currentChatId = useSelector((state) => state.layout.currentChatId);
  const error = useSelector((state) => state.message.error); // Access the error state from Redux

  const handleInputChange = (e) => {
    setMsg(e.target.value);
    adjustTextareaHeight(e.target);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    setMsg("");
    resetInputAndScrollToBottom(textareaRef, messagesContainerRef);
    // Generate a new unique chatId
    const newChatId = uuidv4();
    if (error) {
      dispatch(clearError()); // Clear error when user starts typing
    }
    try {
      await dispatch(
        fetchBotResponse({
          currentModel,
          msg,
          currentChatId: isNewChat ? newChatId : currentChatId,
        })
      ).unwrap();

      if (isNewChat) {
        dispatch(setCurrentChatId(newChatId));
        navigate(`/${userId}/chat/${newChatId}`);
        dispatch(toggleNewChat(false));
        dispatch(
          addLog({
            msg: msg,
            modelType: currentModel.title,
            urlPhoto: currentModel.urlPhoto,
            currentChatId: newChatId,
            firebaseUserId: currentUser ? currentUser.uid : null,
          })
        );
      } else {
        dispatch(
          updateLog({
            logId: currentChatId,
            firebaseUserId: currentUser ? currentUser.uid : null,
            urlPhoto: currentModel.urlPhoto,
          })
        );
      }
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setIsSending(false);
    }
  };
  return (
    <div className="w-full p-4 bg-white dark:bg-gray-800 sticky bottom-0">
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      {msg.length > 1500 && (
        <div className="text-yellow-500 text-sm">
          You have reached {msg.length} of 2000 characters.
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          id="ChatInput"
          className="flex-1 resize-none p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 transition-all duration-300 ease-in-out bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 overflow-y-hidden"
          placeholder="Type your message here..."
          rows={1}
          value={msg}
          maxLength="2000"
          onChange={handleInputChange}
        />
        <button className="p-[3px] relative" disabled={isSending}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-800 rounded-lg" />
          <div
            className={`px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white ${
              isSending
                ? "bg-gray-400 cursor-not-allowed flex justify-center"
                : "hover:bg-transparent"
            }`}
          >
            {isSending ? <FaSpinner className="animate-spin" /> : "Send"}
          </div>
        </button>
      </form>
    </div>
  );
};
export default ChatInput;
