# Chat Helpers

## Overview

Helper functions that support the chat interface functionality. These utilities handle textarea formatting, assistant selection, and new chat creation.

## Core Utilities

### formatHelper.ts

- **Purpose**: Manages textarea formatting and scrolling
- **Functions**:
  - `adjustTextareaHeight`: Auto-resizes textarea based on content
  - `resetInputAndScrollToBottom`: Resets textarea and scrolls messages

### handleModeSelection.ts

- **Purpose**: Manages assistant selection process
- **Function**: `handleModeSelection`
- **Behavior**:
  1. Sets new assistant in Redux
  2. Hides assistant dropdown
  3. Creates new chat session

### newChatHandler.ts

- **Purpose**: Manages new chat creation
- **Function**: `handleNewChat`
- **Behavior**:
  1. Cancels pending chat if exists
  2. Resets current chat ID
  3. Clears errors
  4. Toggles new chat state
  5. Navigates to chat home

## Usage

### Textarea Formatting

```typescript
// In ChatInput component
const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  dispatch(messageActions.updateMsg(e.target.value));
  adjustTextareaHeight(e.target);
};
```

### Assistant Selection

```typescript
// In ModeDropDown or AssistantSelector
handleModeSelection({
  assistant,
  setShowDropdown,
  dispatch,
  navigate,
});
```

### New Chat Creation

```typescript
// In NewChat component
handleNewChat({
  dispatch,
  navigate,
  currentChatId,
  currentUserMessageId,
});
```

## Technical Details

### Dependencies

- Redux for state management
- React Router for navigation
- DOM manipulation for textarea
- TypeScript for type safety

### State Management

- Assistant selection state
- Chat session state
- Error handling
- Navigation state

### Error Handling

- Pending chat cancellation
- Error state clearing
- Navigation fallbacks

## Integration Points

- ChatInput component
- ModeDropDown component
- AssistantSelector component
- NewChat component
