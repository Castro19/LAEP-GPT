import React, { useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import {
  adjustTextareaHeight,
  resetInputAndScrollToBottom,
} from "../../utils/format";
import createNewChatLogId from "../../utils/handleNewChat";
import { useAuth } from "@/contexts/authContext";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleNewChat as toggleReduxNewChat,
  setCurrentChatId as setReduxCurrentChatId,
} from "../../redux/layout/layoutSlice";
import { fetchBotResponse, clearError } from "../../redux/chat/messageSlice";
import {
  addLog as addReduxLog,
  updateLog as updateReduxLog,
} from "../../redux/log/logSlice";
import { useNavigate } from "react-router-dom";

const ChatInput = ({ messagesContainerRef }) => {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [isSending, setIsSending] = useState(false);

  const { currentUser, userId } = useAuth();
  const textareaRef = useRef(null);

  const dispatch = useDispatch();
  const modelType = useSelector((state) => state.model.modelType);
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
    const newChatId = createNewChatLogId();
    if (error) {
      dispatch(clearError()); // Clear error when user starts typing
    }
    try {
      await dispatch(
        fetchBotResponse({
          modelType,
          msg,
          currentChatId: isNewChat ? newChatId : currentChatId,
        })
      ).unwrap();

      if (isNewChat) {
        dispatch(setReduxCurrentChatId(newChatId));
        navigate(`/${userId}/chat/${newChatId}`);
        dispatch(toggleReduxNewChat(false));
        dispatch(
          addReduxLog({
            msg: msg,
            modelType: modelType,
            currentChatId: newChatId,
            firebaseUserId: currentUser ? currentUser.uid : null,
          })
        );
      } else {
        dispatch(
          updateReduxLog({
            logId: currentChatId,
            firebaseUserId: currentUser ? currentUser.uid : null,
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
    <div className="w-full p-4 bg-white dark:bg-gray-800 fixed inset-x-0 bottom-0">
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
        <button
          type="submit"
          disabled={isSending}
          className={`w-auto px-4 py-2 text-white rounded-tr rounded-br ${
            isSending
              ? "bg-gray-400 cursor-not-allowed flex justify-center"
              : "bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-400"
          }`}
        >
          {isSending ? <FaSpinner className="animate-spin" /> : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
