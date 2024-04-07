export async function archiveChatSession(
  msgList,
  currentChatId,
  logList,
  setLogList
) {
  if (logList[currentChatId].content) {
    logList[currentChatId].content = msgList;
    setLogList(logList);
  }
}

export default async function createLogTitle(
  msg,
  currentChatId,
  msgList,
  setLogList
) {
  try {
    console.log(currentChatId);
    // Assuming the title is generated based on the last message or another logic
    const response = await fetch("http://localhost:4000/title", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    const newLog = {
      id: currentChatId, // This should be a unique ID, consider using a more robust method than Date.now() for production
      content: [...msgList], // Spread operator to clone the current msgList
      title: data.title,
      timestamp: new Date().toISOString(),
    };

    setLogList((prevLogList) => [...prevLogList, newLog]);
  } catch (error) {
    console.error(error);
  }
}
