# Create Flowchart Components

## Overview

Components for creating academic flowcharts (academic schedules). Manages the flowchart creation process with progress tracking, user selections, and database integration.

## Components

### CreateFlowchart

- Main container for flowchart creation process
- 4-step progress tracking (Starting Year, Catalog, Major, Concentration)
- User year to start year conversion (senior→2021, junior→2022, etc.)
- Flowchart data fetching and database saving
- Primary flowchart setting and user data updates
- Navigation to created flowchart

### ProgressBar

- Visual progress indicator with 4 step circles
- Animated progress bar fill (0-100%)
- Step completion highlighting with gradients
- Labeled steps with responsive design
- Spring animations for step circles

### FlowChartOptions

- Selection interface with 4 dropdowns
- Starting year (2019-2024), catalog, major, concentration
- Dynamic loading based on selections
- Automatic concentration reset on major change
- User data integration for signup flow
- Icon-based labels and hover animations

## Features

- Multi-step progress tracking
- Dynamic dropdown loading
- User data integration
- Database persistence
- Primary flowchart management
- Responsive design
- Smooth animations
- Error handling with toasts

## State Management

- **Redux**: flowSelectionActions, flowchartActions, userActions
- **Local State**: Progress calculation, form validation
- **User Data**: Flowchart information updates

## Data Flow

1. User selections → Progress calculation → Step validation
2. Catalog selection → Major options → Concentration options
3. Complete selections → Flowchart creation → Database save → Navigation

## Dependencies

- Redux state management
- React Router navigation
- Framer Motion animations
- ReusableDropdown components
- User data hooks
- Flowchart API helpers
