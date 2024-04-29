import React, { useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa"; // Example using React Icons
// Helpers:
import {
  adjustTextareaHeight,
  resetInputAndScrollToBottom,
} from "../../utils/format";
import createNewChatLogId from "../../utils/handleNewChat";
// Context: For user information
import { useAuth } from "@/contexts/authContext";

// Redux:
import { useSelector, useDispatch } from "react-redux";
import {
  toggleNewChat as toggleReduxNewChat,
  setCurrentChatId as setReduxCurrentChatId,
} from "../../redux/ui/uiSlice";
import { fetchBotResponse } from "../../redux/message/messageSlice";
import {
  addLog as addReduxLog,
  // updateCurrentChat as updateReduxCurrentChat,
  updateLog as updateReduxLog,
} from "../../redux/message/messageSlice";

const ChatInput = ({ messagesContainerRef }) => {
  const [msg, setMsg] = useState(""); // local state for input value
  // State variables only used for this component
  const [_error, setError] = useState(null); // An error context might be created in the future
  const [isSending, setIsSending] = useState(false);

  // User information:
  const { currentUser } = useAuth();

  // Reference to the DOM element: For the text area where user inputs their message.
  const textareaRef = useRef(null);

  const dispatch = useDispatch();
  // Redux State Vars:
  const modelType = useSelector((state) => state.model.modelType); // Access the modelType from Redux store

  const isNewChat = useSelector((state) => state.ui.isNewChat);
  const currentChatId = useSelector((state) => state.ui.currentChatId);

  const handleInputChange = (e) => {
    // Modify the Message State variable
    setMsg(e.target.value);
    // automatically change the height of the input text area with helper format function,  Find this f'n in src/utils/format
    adjustTextareaHeight(e.target); // helper format function
  };

  // When user sends their message:
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true); // Disable the send button

    // Resetting the message will clear the message in the text area b4 async call f'n returns
    // Will still pass the user's message correctly to `sendMessage`
    setMsg("");

    // Scroll to the bottom of the message container
    resetInputAndScrollToBottom(textareaRef, messagesContainerRef);

    try {
      // *** This makes the API request and handles the response ***
      await dispatch(fetchBotResponse({ modelType, msg }));
    } catch (error) {
      console.error("Failed to send message", error);
      setError(error.toString());
    } finally {
      // Re-enable sending button
      setIsSending(false);
      if (isNewChat) {
        // Create the chatID &
        const newChatId = createNewChatLogId();
        dispatch(setReduxCurrentChatId(newChatId));
        dispatch(toggleReduxNewChat(false));

        // Create the Title of the chat and adds a new log
        dispatch(
          addReduxLog({
            msg: msg,
            modelType: modelType,
            currentChatId: newChatId,
            firebaseUserId: currentUser ? currentUser.uid : null,
          })
        );
      } else {
        console.log("logID: ", currentChatId);
        console.log("firebaseUserId: ", currentUser ? currentUser.uid : null);
        dispatch(
          updateReduxLog({
            logId: currentChatId,
            firebaseUserId: currentUser ? currentUser.uid : null,
          })
        );
      }
    }
  };

  // ChatInput Component:
  return (
    <div className="w-full p-4 bg-white dark:bg-gray-800 fixed inset-x-0 bottom-0">
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
