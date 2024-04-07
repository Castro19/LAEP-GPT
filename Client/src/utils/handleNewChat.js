let lastChatId = 0; // This will be replaced with UUIDs later

export default function createNewChatLogId(
  setCurrentChatId,
  setIsNewChat,
  setMsgList
) {
  const newChatId = ++lastChatId; // Simple increment for uniqueness
  setCurrentChatId(newChatId); // Set the new unique ID for the chat session
  setIsNewChat(true); // Flag indicating it's a new chat
  setMsgList([]); // Reset the message list for the new chat
}
