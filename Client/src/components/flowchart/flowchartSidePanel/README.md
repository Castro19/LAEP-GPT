# Flowchart Side Panel Components

## Overview

Side panel components for flowchart management and course selection. Provides flowchart information, saved flowcharts list, course dropdowns, and new flowchart creation functionality.

## Components

### FlowchartBuilderForm

- Main side panel form container
- Flowchart information display
- Saved flowcharts management
- Course selection interface
- New flowchart creation button
- Tab switching integration

### FlowchartInfo

- Current flowchart information display
- Catalog, major, and concentration info
- External link to official flowchart
- Empty state when no flowchart selected
- Smooth entrance animations

### SavedFlowchartList

- List of user's saved flowcharts
- Flowchart selection and navigation
- Flowchart name editing
- Primary flowchart setting
- Flowchart deletion with confirmation
- Active flowchart highlighting

### CourseDropdown

- Course type categorization (GWR, USCP)
- Subject-based course organization
- Dynamic course loading
- Course search functionality
- Collapsible course sections
- Memory-efficient loading

### SidebarCourse

- Individual course display for sidebar
- Course completion status
- Tooltip with course description
- Hover animations and transitions
- Color-coded course display

### GeDropdown

- General education course selection
- Subject-based organization
- Course filtering and search

### TechElectiveDropdown

- Technical elective course selection
- Major-specific course filtering
- Course requirements display

### CourseSearchbar

- Course search functionality
- Real-time search results
- Course selection interface

### FlowchartLogOptions

- Flowchart logging and analytics
- User interaction tracking
- Performance monitoring

## Features

- Flowchart management and editing
- Course selection and categorization
- Dynamic course loading
- Search functionality
- Responsive design
- Tab switching integration
- Toast notifications
- Smooth animations

## State Management

- **Redux**: flowchartActions, user state, flowchart data
- **Local State**: Course data, search states, UI states
- **User Data**: Flowchart information updates

## Data Flow

1. Flowchart selection → Info display → Course loading → User interaction
2. Course search → API call → Results display → Course selection
3. Flowchart editing → Redux update → Database save → UI refresh

## Dependencies

- Redux state management
- React Router navigation
- Course API integration
- UI components (Card, Button, Tooltip)
- Framer Motion animations
- Collapsible content wrappers
