# ChatWidget Component

A versatile floating chat interface component that can be integrated into any page of the application. Currently implemented in the ScheduleBuilder but designed to be adaptable for other pages like Flowchart and future features.

## Overview

The ChatWidget provides a floating chat interface that can be:

- Minimized to a small icon
- Maximized to a full chat window
- Resized to custom dimensions
- Positioned in any corner of the screen
- Customized with different chat interfaces

## Features

### Core Functionality

- Floating window with minimize/maximize controls
- Resizable dimensions with minimum/maximum constraints
- Smooth animations for all state transitions
- Pulsing notification when minimized
- Responsive design that works on all screen sizes

### Technical Features

- Built with React and TypeScript
- Uses Framer Motion for smooth animations
- Implements drag-to-resize functionality
- Maintains state persistence
- Supports custom chat interfaces

## Integration Guide

### Basic Implementation

```tsx
import { ChatWidget } from "@/components/chatWidget/ChatWidget";

function YourPage() {
  return (
    <div>
      {/* Your page content */}
      <ChatWidget initialOpen={false} />
    </div>
  );
}
```

### Customization Options

1. **Position Customization**

   - Currently fixed to bottom-right
   - Can be modified by adjusting the positioning classes in the component

2. **Size Customization**

   - Default size: 400x600px when open
   - Minimum size: 200x100px
   - Maximum size: 600px width, window height - 8px

3. **Chat Interface Customization**
   - Currently uses ScheduleBuilderAIChat components
   - Can be adapted to use different chat interfaces by:
     - Creating new chat interface components
     - Modifying the imports and component usage
     - Adjusting the layout to match the new interface

## Adapting for Different Pages

### 1. Create Page-Specific Chat Interface

```tsx
// Example for Flowchart page
import { ChatWidget } from "@/components/chatWidget/ChatWidget";
import { FlowchartChatInterface } from "./FlowchartChatInterface";

function FlowchartPage() {
  return (
    <div>
      <ChatWidget initialOpen={false} chatInterface={FlowchartChatInterface} />
    </div>
  );
}
```

### 2. Modify Component Props

The component can be extended to accept additional props:

- `position`: For custom positioning
- `chatInterface`: For different chat implementations
- `theme`: For different styling options
- `persistenceKey`: For maintaining state across sessions

### 3. Styling Customization

The component uses Tailwind CSS classes that can be modified:

- Background colors
- Border styles
- Animation timings
- Shadow effects

## Best Practices

1. **State Management**

   - Consider using global state management for chat history
   - Implement proper cleanup in useEffect hooks
   - Handle window resize events appropriately

2. **Performance**

   - Use React.memo for child components
   - Implement proper event listener cleanup
   - Optimize animations for lower-end devices

3. **Accessibility**
   - Ensure proper ARIA labels
   - Maintain keyboard navigation
   - Support screen readers

## Future Improvements

1. **Planned Features**

   - Mobile-optimized layout

2. **Potential Enhancements**
   - Drag-and-drop positioning

## Dependencies

- React
- TypeScript
- Framer Motion
- Lucide React (for icons)
- Tailwind CSS

## Contributing

When adapting this component for new pages:

1. Create page-specific chat interfaces
2. Maintain consistent styling
3. Follow the established animation patterns
4. Add proper TypeScript types
5. Update documentation
