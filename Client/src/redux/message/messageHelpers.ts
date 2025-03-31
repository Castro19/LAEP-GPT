import { setToolUsage } from "./messageSlice";

export const handleToolUsageMarkers = (
  text: string,
  botMessageId: string,
  currentChatId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: any
): string => {
  if (text.includes("[WEB_SEARCH_START]")) {
    dispatch(
      setToolUsage({
        id: botMessageId,
        toolUsage: "Searching the web...",
        chatId: currentChatId,
      })
    );
    text = text.replace("[WEB_SEARCH_START]", "");
  }

  if (text.includes("[FILE_SEARCH_START]")) {
    dispatch(
      setToolUsage({
        id: botMessageId,
        toolUsage: "Searching through all clubs...",
        chatId: currentChatId,
      })
    );
    text = text.replace("[FILE_SEARCH_START]", "");
  }

  if (text.includes("[PROFESSOR_RATINGS_HELPER_START]")) {
    dispatch(
      setToolUsage({
        id: botMessageId,
        toolUsage: "Searching for professors...",
        chatId: currentChatId,
      })
    );
    text = text.replace("[PROFESSOR_RATINGS_HELPER_START]", "");
  }

  if (text.includes("[PROFESSOR_RATINGS_HELPER_DONE]")) {
    dispatch(
      setToolUsage({
        id: botMessageId,
        toolUsage: "Filtering through professor ratings...",
        chatId: currentChatId,
      })
    );
    text = text.replace("[PROFESSOR_RATINGS_HELPER_DONE]", "");
  }
  if (text.includes("[ANALYSIS_START]")) {
    dispatch(
      setToolUsage({
        id: botMessageId,
        toolUsage: "Analyzing your request...",
        chatId: currentChatId,
      })
    );
    text = text.replace("[ANALYSIS_START]", "");
  }

  if (
    text.includes("[FILE_SEARCH_DONE]") ||
    text.includes("[WEB_SEARCH_DONE]") ||
    text.includes("[ANALYSIS_DONE]")
  ) {
    text = text
      .replace("[FILE_SEARCH_DONE]", "")
      .replace("[WEB_SEARCH_DONE]", "")
      .replace("[ANALYSIS_DONE]", "");
    dispatch(
      setToolUsage({
        id: botMessageId,
        toolUsage: null,
        chatId: currentChatId,
      })
    );
  }

  return text;
};
