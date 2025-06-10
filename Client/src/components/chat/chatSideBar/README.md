# Chat Sidebar Components

## Overview

The chat sidebar components provide an alternative interface for assistant selection, optimized for sidebar display. These components offer a more detailed view of available assistants and their capabilities.

## Core Components

### AssistantSelector

- Main sidebar container for assistant selection
- Displays list of available assistants
- Handles assistant selection and switching
- Manages selection state in Redux

### AssistantItem

- Individual assistant display component
- Shows assistant details and status
- Handles selection interaction
- Manages locked/unlocked state

## Key Features

### Assistant Display

- Detailed assistant information
- Avatar and description display
- Selection state indication
- Access status management

### Selection Management

- Easy assistant switching
- Current selection highlighting
- State persistence
- Redux integration

## Technical Implementation

### State Management

- Redux for assistant selection
- Current model tracking
- Selection state handling
- Access control management

### Dependencies

- Redux for state management
- UI Components for interface
- Icons for visual elements
- Shared types for data structure

## Component Flow

### Assistant Selection

1. **Display**:

   - Load available assistants
   - Show current selection
   - Present detailed information

2. **Interaction**:
   - User selects assistant
   - Update Redux state
   - Update UI state
   - Handle access control

### Item Display

1. **Rendering**:

   - Show assistant avatar
   - Display name and description
   - Indicate selection state
   - Show access status

2. **Interaction**:
   - Handle click events
   - Update selection
   - Manage locked state
   - Update parent component

## UI/UX Features

- Clear assistant information display
- Intuitive selection interface
- Consistent styling
- Responsive design
- Access control indicators

## Mobile Considerations

- Sidebar collapse behavior
- Touch-friendly interface
- Responsive layout
- Mobile-optimized interactions
