# Chat Header Components

## Overview

The chat header components provide the top-level controls for the chat interface, including assistant selection and new chat functionality. These components manage the chat session state and user preferences.

## Core Components

### ModeDropDown

- Displays available AI assistants
- Handles assistant selection
- Shows assistant information and capabilities
- Updates current model in Redux state

### NewChat

- Provides new chat session initialization
- Resets chat state and history
- Maintains current assistant selection
- Handles navigation for new sessions

## Key Features

### Assistant Management

- List of available assistants
- Assistant descriptions and capabilities
- Easy switching between models
- Current selection persistence

### Chat Session Control

- New chat initialization
- State reset functionality
- Navigation management
- History clearing

## Technical Implementation

### State Management

- Redux for assistant selection
- Redux for chat session state
- Navigation state handling
- Model persistence

### Dependencies

- Redux for state management
- React Router for navigation
- UI Components for interface
- Icons for visual elements

## Component Flow

### Assistant Selection

1. **Display**:

   - Load available assistants
   - Show current selection
   - Present assistant details

2. **Selection**:
   - User selects assistant
   - Update Redux state
   - Maintain selection

### New Chat Flow

1. **Initialization**:

   - User clicks new chat
   - Reset chat state
   - Clear message history

2. **Navigation**:
   - Update Redux state
   - Navigate to chat home
   - Prepare for new session

## UI/UX Features

- Clear assistant selection interface
- Intuitive new chat button
- Consistent styling
- Responsive design
