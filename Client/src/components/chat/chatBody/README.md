# Chat Body Components

## Overview

The chat body components form the core of the chat interface, handling message display, loading states, and user interactions. Each component is designed to work together to create a seamless chat experience.

## Core Components

### ChatContainer

- Main container for desktop chat interface
- Manages message layout and auto-scrolling behavior
- Handles dynamic height based on route
- Auto-scrolls to bottom on new messages unless user has scrolled up
- Toggles between suggested messages and chat history

### MobileChatContainer

- Mobile-optimized version of ChatContainer
- Uses safe-bottom-inset to prevent footer overlap with mobile navigation
- Fixed footer positioning for better mobile UX
- Reduced height (70%) for mobile viewport
- Inherits core chat functionality from ChatContainer

### ChatMessage

- Renders individual chat messages
- Supports markdown formatting with secure HTML conversion
- Different styling for user and assistant messages
- Like/dislike reaction functionality
- Assistant avatar display
- Responsive design with mobile optimizations
- Uses markdown-it and DOMPurify for secure rendering

### ChatLoadingMessage

- Displays loading state when AI is processing
- Shows tool usage information during AI operations
- Animated skeleton loading UI
- Smooth fade-in animations using framer-motion
- Responsive design for different screen sizes

### AssistantSuggestedMessages

- Displays suggested questions for new chat sessions
- Appears only at the start of a conversation
- Typewriter effect welcome message
- Grid layout for suggested questions
- Automatically sends selected question

## State Management

- Uses Redux for:
  - Message history and current chat
  - Loading states
  - User reactions
  - Tool usage information
  - Assistant model data

## Key Features

- Real-time message updates
- Secure markdown rendering
- Message reactions (like/dislike)
- Loading states with tool usage
- Suggested questions for new chats
- Responsive design
- Dark mode support
- Mobile-optimized layout

## Component Interactions

1. **New Chat Flow**:

   - AssistantSuggestedMessages shows initial questions
   - User selects or types a question
   - ChatMessage displays the conversation
   - ChatLoadingMessage shows during AI processing

2. **Message Display Flow**:

   - ChatContainer/MobileChatContainer manages layout
   - ChatMessage renders individual messages
   - ChatLoadingMessage shows during AI responses
   - User can react to messages

3. **Mobile Experience**:
   - MobileChatContainer handles mobile-specific layout
   - Safe area insets prevent navigation overlap
   - Optimized for mobile viewport

## Technical Considerations

- Secure markdown-to-HTML conversion
- Efficient message rendering
- Responsive design patterns
- State management best practices
- Mobile-first approach

## Future Improvements

- Advanced message formatting for tool usage
- Improved mobile experience
