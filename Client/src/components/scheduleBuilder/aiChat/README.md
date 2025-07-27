# AI Chat Components

This folder contains the AI chat functionality for the schedule builder feature in the LAEP application. These components provide a conversational interface for users to interact with an AI assistant to build and manage their academic schedules.

## Overview

The AI chat system consists of several key areas:

- **Core Components**: Main structural components for the chat interface
- **Messages**: Components for displaying chat messages and conversation turns
- **Input**: User input and interaction components
- **Tools**: Components for displaying AI tool usage and functionality
- **Logs**: Chat history and log management components
- **Header**: Chat header and navigation components
- **Helpers**: Utility functions and formatting helpers

## Component Structure

### Core Components

#### `ScheduleBuilderAIChat.tsx`

The main chat interface component that combines message display and input.

**Features:**

- Responsive height calculation based on parent container
- Scrollable message area with proper overflow handling
- Fixed input area at the bottom
- Proper ref forwarding for external control
- Dark theme styling

**Key Functions:**

- Layout management for chat interface
- Height calculations for responsive design
- Integration with message container and input components

#### `ChatContainerScheduleBuilder.tsx`

Container component for managing chat messages and scroll behavior.

**Features:**

- Automatic message list management from Redux state
- Smart scroll behavior that respects user position
- Empty state with suggested messages
- Scroll position tracking and restoration
- First message handling for initial scroll

**Key Functions:**

- `checkIfUserAtBottom()`: Determines if user is near bottom of scroll area
- `findScrollAreaViewport()`: Locates scroll area viewport element
- Automatic scroll management for new messages

### Message Components

#### `SBChatMessage.tsx`

Individual chat message component with support for tool calls and loading states.

**Features:**

- User and assistant message differentiation
- Tool call display with collapsible details
- Loading state handling
- Message formatting and styling
- Tool-specific rendering (fetch_sections, manage_schedule)
- Accordion interface for tool details

**Message Types:**

- User messages: Right-aligned with gradient background
- Assistant messages: Left-aligned with different gradient
- Tool calls: Expandable accordion with tool details
- Loading messages: Animated loading state

#### `TurnConversationItem.tsx`

Component for displaying individual conversation turns.

#### `FormattedChatMessage.tsx`

Component for formatting and displaying chat messages.

#### `AIChatLoadingMessage.tsx`

Component for displaying loading states during AI processing.

### Input Components

#### `ScheduleBuilderChatInput.tsx`

Input component for AI chat with placeholder suggestions and message handling.

**Features:**

- Placeholder suggestions for common queries
- Real-time input validation and character counting
- Optimistic message updates for better UX
- Automatic schedule initialization
- Thread management for conversation continuity
- Error handling and user feedback
- Loading state management

**Placeholders:**

- "Find GE B classes in the morning"
- "Find open CSC101 classes"
- "Add an easy USCP class"

#### `SBAssistantSuggestedMessages.tsx`

Component for displaying suggested messages when chat is empty.

### Tool Components

#### `CurrentToolCall.tsx`

Tooltip component for displaying current tool call status.

**Features:**

- Real-time tool call status display
- Animated icon states during streaming
- Pinnable tooltip for persistent viewing
- Auto-scroll during content streaming
- Minimization state handling
- Tool name rendering and formatting

#### `SBFetchSections.tsx`

Component for displaying fetched course sections in AI chat.

**Features:**

- Parses section data from tool messages
- Displays fetch operation arguments
- Shows fetched sections using SectionsChosen
- Automatic section fetching by class numbers
- Backward compatibility with old message formats
- Error handling for malformed JSON

#### `SBManageSchedule.tsx`

Component for displaying schedule management operations.

#### `ToolUsageDisplay.tsx`

Component for displaying tool usage information.

### Log Components

#### `ScheduleBuilderLogs.tsx`

Component for displaying and managing schedule builder chat logs.

**Features:**

- List of saved chat logs with titles and timestamps
- Click to load specific log conversations
- Hover-based options menu for each log
- Automatic log fetching and state management
- Responsive design for different screen sizes
- Close functionality for panel management

#### `ScheduleLogsOptions.tsx`

Component for log management options (delete, rename, etc.).

#### `SectionChanges.tsx`

Component for displaying section changes in chat logs.

### Header Components

#### `ScheduleBuilderAIChatHeader.tsx`

Header component for the AI chat interface.

**Features:**

- Toggle chat logs display
- New chat button
- Automatic log fetching when logs are opened
- Responsive design for different screen sizes
- Proper state management for log visibility

#### `SBNewChat.tsx`

Component for starting new chat conversations.

### Helper Components

#### `FormattingStrs.tsx`

Helper functions for formatting tool calls and messages.

**Features:**

- Tool name rendering based on tool type and arguments
- Operation message formatting for schedule management
- Fetch sections message formatting
- Type-safe argument handling
- Development environment logging

**Exports:**

- `renderToolName`: Formats tool names for display
- `renderOperation`: Formats operation messages
- `OperationMessage`: React component for operation display
- `renderFetchType`: Formats fetch operation messages
- `FetchSectionsMessage`: React component for fetch display
- `renderToolMessage`: Generic tool message formatter

#### `newScheduleBuilderChatHandler.ts`

Handler for new chat creation and management.

### Type Definitions

#### `types/index.ts`

TypeScript interfaces for AI chat components.

**Interfaces:**

- `ChatContainerProps`: Props for chat container components
- `ScheduleBuilderAIChatProps`: Props for main AI chat component
- `TurnConversationItemProps`: Props for conversation turn items
- `ChatInputProps`: Props for chat input components
- `SuggestedMessagesProps`: Props for suggested messages

### Constants

#### `constants/index.ts`

Shared constants for AI chat functionality.

**Constants:**

- `SCROLL`: Scroll behavior constants
- `LAYOUT`: Layout constants
- `CLASSES`: Component class names

## Key Features

### AI Chat Interface

- **Conversational UI**: Natural language interaction with AI assistant
- **Real-time Streaming**: Live message streaming with typing indicators
- **Tool Integration**: Visual display of AI tool usage and results
- **Message History**: Persistent conversation history with log management
- **Suggested Messages**: Helpful suggestions for common queries

### Tool System

- **Fetch Sections**: AI can search and fetch course sections
- **Manage Schedule**: AI can add/remove sections from user's schedule
- **Tool Visualization**: Clear display of tool calls and their results
- **Error Handling**: Graceful handling of tool failures
- **Loading States**: Visual feedback during tool execution

### Message Management

- **Message Types**: Support for user, assistant, and tool messages
- **Formatting**: Rich text formatting with markdown support
- **Collapsible Details**: Expandable tool call details
- **Scroll Management**: Smart scrolling that respects user position
- **Empty States**: Helpful suggestions when chat is empty

### Log System

- **Conversation History**: Persistent storage of chat conversations
- **Log Management**: View, delete, and manage saved conversations
- **Thread-based**: Each conversation is a separate thread
- **Timestamp Tracking**: Automatic timestamp management
- **Search and Filter**: Easy navigation through conversation history

### User Experience

- **Responsive Design**: Adapts to different screen sizes
- **Dark Theme**: Consistent dark theme throughout
- **Keyboard Navigation**: Full keyboard accessibility
- **Loading States**: Clear feedback during operations
- **Error Handling**: User-friendly error messages

## State Management

The components use Redux for state management with the following key slices:

- **scheduleBuilderLog**: Chat logs, messages, and conversation state
- **schedule**: Current schedule and preferences
- **sectionSelection**: Selected sections for schedule building

## Dependencies

### Core Dependencies

- **Redux Toolkit**: State management
- **React Router**: Navigation
- **Framer Motion**: Animations and transitions
- **nanoid**: Unique ID generation

### UI Dependencies

- **Radix UI**: Accessible UI primitives (Tooltip, Accordion, ScrollArea)
- **Lucide React**: Icons
- **React Icons**: Additional icon sets
- **Tailwind CSS**: Styling

### Custom Components

- **PlaceholdersAndVanishInput**: Enhanced input with placeholders
- **FormattedChatMessage**: Message formatting component
- **SectionsChosen**: Section display component

## Usage Examples

### Basic AI Chat Setup

```tsx
import { ScheduleBuilderAIChat } from "./aiChat";

function ScheduleBuilderPage() {
  const sendButtonRef = useRef<HTMLButtonElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <ScheduleBuilderAIChat
      currentHeight={600}
      sendButtonRef={sendButtonRef}
      messagesContainerRef={messagesContainerRef}
      textareaRef={textareaRef}
    />
  );
}
```

### Custom Message Display

```tsx
import { SBChatMessage } from "./aiChat/messages";

function MessageDisplay() {
  return <SBChatMessage msg={messageData} />;
}
```

### Tool Call Display

```tsx
import { SBFetchSections } from "./aiChat/tools";

function ToolDisplay() {
  return (
    <SBFetchSections
      args={{ fetch_type: "search", search_query: "CSC 101" }}
      message={toolMessage}
    />
  );
}
```

### Log Management

```tsx
import { ScheduleBuilderLogs } from "./aiChat/logs";

function LogManagement() {
  return <ScheduleBuilderLogs onClose={() => setShowLogs(false)} />;
}
```

## Best Practices

### Performance

- Use React.memo for expensive components
- Implement proper key props for message lists
- Optimize re-renders with useMemo and useCallback
- Lazy load components when appropriate

### Accessibility

- Provide proper ARIA labels and roles
- Ensure keyboard navigation support
- Use semantic HTML elements
- Test with screen readers

### Error Handling

- Implement comprehensive error boundaries
- Provide user-friendly error messages
- Handle network failures gracefully
- Validate user input thoroughly

### Code Organization

- Keep components focused and single-purpose
- Use TypeScript for type safety
- Follow consistent naming conventions
- Document complex logic with comments

## Future Enhancements

### Planned Features

- **Voice Input**: Speech-to-text for message input
- **Message Reactions**: Emoji reactions for messages
- **File Attachments**: Support for file uploads
- **Advanced Search**: Enhanced conversation search
- **Collaboration**: Share conversations with other users

### Technical Improvements

- **Performance Optimization**: Virtual scrolling for large message lists
- **Offline Support**: Offline message composition
- **Real-time Updates**: Live updates for shared conversations
- **Advanced Analytics**: Chat usage analytics and insights
- **Multi-language Support**: Internationalization for chat interface
