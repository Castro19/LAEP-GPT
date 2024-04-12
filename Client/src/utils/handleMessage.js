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

      const render = response.body.getReader();
      let botMessageId = Date.now() + 1;
      let accumulatedText = "";
      setMsgList((prevMessages) => [
        ...prevMessages,
        { id: botMessageId, sender: "bot", text: "Loading..." },
      ]);

      while (true) {
        const { done, value } = await render.read(); // value is a Uint8Array
        const decoder = new TextDecoder();
        if (done) break;

        const chunks = decoder.decode(value).split("\n");
        chunks.forEach((chunk) => {
          if (chunk) {
            const obj = JSON.parse(chunk);
            accumulatedText += obj.choices[0].delta.content ?? "" + " ";

            setMsgList((prevMessages) => {
              return prevMessages.map((message) =>
                message.id === botMessageId
                  ? { ...message, text: accumulatedText }
                  : message
              );
            });
          }
        });
      }

      setMsgList((prevMessages) => {
        return prevMessages.map((message) =>
          message.id === botMessageId
            ? { ...message, text: accumulatedText.trim() }
            : message
        );
      });
    } catch (error) {
      setError(error.toString());
      console.error(error);
    }
  } else {
    setError("Message is over 500 words, please shorten it.");
    console.log("Request shorter message");
  }
}
