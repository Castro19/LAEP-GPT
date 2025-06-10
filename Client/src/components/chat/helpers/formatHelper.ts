/**
 * @file formatHelper.ts
 * @description Helper functions for textarea formatting and scrolling in ChatInput component.
 *
 * @function adjustTextareaHeight
 * @description Automatically adjusts textarea height based on content.
 * @param {HTMLTextAreaElement} textarea - The textarea element to adjust
 *
 * @function resetInputAndScrollToBottom
 * @description Resets textarea height and scrolls message container to bottom.
 * @param {React.RefObject<HTMLTextAreaElement>} textareaRef - Reference to textarea
 * @param {React.RefObject<HTMLDivElement>} messagesContainerRef - Reference to message container
 */

export const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
  const maxHeight = 250; // Max height you want the textarea to grow to
  textarea.style.height = "auto"; // Reset height so scrollHeight includes only text
  const newHeight =
    textarea.scrollHeight > maxHeight ? maxHeight : textarea.scrollHeight;

  textarea.style.height = `${newHeight}px`; // Set new height
  textarea.style.overflowY = newHeight >= maxHeight ? "scroll" : "hidden"; // Show scrollbar only when at max height
};

export function resetInputAndScrollToBottom(
  textareaRef: React.RefObject<HTMLTextAreaElement>,
  messagesContainerRef: React.RefObject<HTMLDivElement>
) {
  // Reset textarea height

  if (textareaRef.current) {
    textareaRef.current.style.height = "auto";
  }

  // Ensure scrolling to the bottom of the messages container
  setTimeout(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, 0); // Timeout ensures this runs after the DOM has updated
}
