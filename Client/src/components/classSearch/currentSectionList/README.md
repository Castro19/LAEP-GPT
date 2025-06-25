# Current Section List

## Overview

Components for displaying and managing course sections in a hierarchical structure. Renders courses grouped by professor with enrollment info, scheduling, and schedule integration.

## Components

### SectionDoc

- Main container for course catalog display
- Collapsible course sections with professor grouping
- Course info, prerequisites, and section counts
- Expand/collapse all functionality
- Responsive design for mobile/desktop

### SectionInfo

- **SectionHeader**: Component type badge, enrollment status, section number
- **SectionEnrollment**: Instruction mode, seats available, waitlist info
- **SectionSchedule**: Meeting times, locations, add to schedule buttons
- Toast notifications for schedule actions
- Paired section handling (lecture + lab)

### SectionCourseDropdown

- Searchable dropdown for course selection
- Debounced API calls (300ms delay)
- Real-time course suggestions
- Loading states and error handling
- Catalog year integration

## Features

- Course catalog with hierarchical display
- Professor grouping with ratings
- Section enrollment status and capacity
- Instruction mode display (PA, SM, P, PS, AM, SA)
- Add sections to schedule with conflict checking
- Paired section management
- Toast notifications with navigation
- Responsive design
- Search functionality with autocomplete

## State Management

- **Redux**: sectionSelectionActions, classSearch state, flowchartData
- **Local State**: Expanded courses, search input, loading states

## Data Flow

1. Course data → SectionDoc → CourseSection → ProfessorGroup → SectionCard
2. Section selection → Redux action → Schedule builder integration
3. Course search → Debounced API → Dropdown suggestions → Selection

## Dependencies

- Collapsible UI components
- BadgeSection and LabelSection
- Toast notifications
- React Router navigation
- Course API integration
