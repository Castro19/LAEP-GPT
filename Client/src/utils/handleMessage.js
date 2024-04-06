export default async function sendMessage(
  modelType,
  msg,
  setMsgList,
  setError
) {
  if (msg.trim() && msg.length < 2000) {
    const newUserMessage = {
      id: Date.now(),
      sender: "user",
      text: msg,
      mode: modelType,
    };
    setMsgList((prevMessages) => [...prevMessages, newUserMessage]);

    try {
      const response = await fetch("http://localhost:4000/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, modelType: modelType }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      const newBotMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: data.botResponse,
      };
      setMsgList((prevMessages) => [...prevMessages, newBotMessage]);
    } catch (error) {
      setError(error.toString());
      console.error(error);
    }
  } else {
    setError("Message is over 500 words, please shorten it.");
    console.log("Request shorter message");
  }
}
