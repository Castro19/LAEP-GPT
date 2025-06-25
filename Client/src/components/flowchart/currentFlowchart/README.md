# Current Flowchart Components

## Overview

Components for displaying and interacting with academic flowcharts (academic schedules). Provides carousel navigation, full-screen view, course management, and progress tracking.

## Components

### FlowChart

- Main flowchart display with carousel navigation
- Year-based navigation with hover animations
- Course completion toggling
- Full timeline view support
- Term mapping (Fall, Winter, Spring)
- Skip term filtering

### YearSelector

- Year-based tab navigation (Year 1, Year 2, etc.)
- Full timeline view option
- Responsive design for narrow screens
- Active state highlighting and hover effects

### TermContainer

- Single term display with drag-and-drop
- Bulk term completion (add/remove all courses)
- Scrollable course list
- Term unit calculation and display
- Course count display

### CourseItem

- Individual course display with completion toggling
- Tooltip with detailed course information
- Context menu for course deletion
- Unit calculation and custom unit support
- Color-coded course display

### FullScreenFlowchart

- Full timeline view showing all terms simultaneously
- Grid layout for desktop, scrollable for mobile
- Dynamic column sizing based on term count
- Mobile-optimized horizontal scrolling

### FullScreenTermContainer

- Term container optimized for full-screen view
- Compact course display
- Term header with completion controls

### FullScreenCourseItem

- Course item optimized for full-screen view
- Compact layout with essential information
- Touch-friendly interactions

### CourseTooltipContent

- Detailed course information for tooltips
- Course ID, display name, units, prerequisites
- Course description and custom information

### FlowchartUnitCounts

- Unit count summary for entire flowchart
- Total, completed, and remaining unit tracking
- Progress percentage display

## Features

- Carousel-based term navigation
- Drag-and-drop course reordering
- Course completion tracking
- Full-screen timeline view
- Responsive design (mobile/desktop)
- Unit calculation and progress tracking
- Context menus and tooltips
- Hover animations and transitions

## State Management

- **Redux**: flowchartActions for data updates, layout state
- **Local State**: Carousel API, hover timers, tooltip states
- **User Interactions**: Course completion, term operations

## Data Flow

1. Flowchart data → Term mapping → Carousel display → Course rendering
2. User interaction → Redux action → Data update → UI refresh
3. Year selection → Carousel scroll → Term focus → Course display

## Dependencies

- Redux state management
- Carousel UI components
- Drag-and-drop functionality
- Tooltip and context menu components
- Responsive design hooks
- Framer Motion animations
