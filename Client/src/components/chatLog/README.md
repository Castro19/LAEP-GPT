# Chat Log Components

This directory contains components for managing and displaying chat history in the sidebar. The components work together to provide a complete chat history management system.

## Components

### ChatLogList

The main container component that displays a list of recent chat conversations. It manages the overall chat history display and selection.

**Key Features:**

- Displays list of recent chat conversations
- Handles chat selection
- Manages empty state display
- Provides scroll functionality
- Integrates with Redux for state management

### ChatLog

Individual chat log item component that displays information about a single chat conversation.

**Key Features:**

- Shows chat title and assistant information
- Displays last message and timestamp
- Indicates active/selected state
- Provides access to chat options
- Handles chat selection

### ChatLogOptions

Options menu component for managing individual chat logs. Provides functionality for modifying chat properties.

**Key Features:**

- Rename chat title
- Delete chat log
- Confirmation dialogs
- Error handling
- Redux state updates

## Component Relationships

```
ChatLogList
├── ChatLog
│   └── ChatLogOptions
└── Empty State
```

- `ChatLogList` is the parent component that manages the list of chats
- `ChatLog` components are rendered within the list for each chat
- `ChatLogOptions` is rendered when a chat's options are accessed

## State Management

The components use Redux for state management through the following slices:

- `logSlice`: Manages chat logs, current selection, and chat operations
- `assistantSlice`: Provides assistant information for each chat

## Usage

```tsx
// Example usage in a parent component
import { ChatLogList } from "./chatLog";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ChatLogList />
    </div>
  );
};
```

## Props

### ChatLogList

- `logs`: Array of chat logs to display
- `currentLogId`: ID of currently selected chat
- `onSelectLog`: Function to handle chat selection

### ChatLog

- `id`: Chat log ID
- `title`: Chat title
- `assistantName`: Name of the assistant
- `assistantAvatar`: Assistant's avatar URL
- `lastMessage`: Last message in chat
- `lastMessageTime`: Timestamp of last message
- `isActive`: Whether chat is currently selected
- `onSelect`: Function to select this chat

### ChatLogOptions

- `id`: Chat log ID
- `title`: Current chat title
- `onClose`: Function to close options menu

## Styling

The components use Tailwind CSS for styling and maintain a consistent look with the rest of the application. Key styling features include:

- Responsive design
- Hover and active states
- Consistent spacing and typography
- Dark mode support

## Dependencies

- Redux for state management
- React for UI components
- Tailwind CSS for styling
- React Icons for icons
