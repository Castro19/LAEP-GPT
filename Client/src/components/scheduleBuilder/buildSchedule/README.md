# Build Schedule Components

This folder contains the core components for the schedule building functionality in the LAEP application. These components work together to provide a comprehensive interface for creating, managing, and customizing academic schedules.

## Overview

The build schedule system consists of several key areas:

- **Main Form**: Central interface for schedule generation and management
- **Selected Sections**: Display and management of chosen course sections
- **Time Conflicts**: Detection and resolution of scheduling conflicts
- **Saved Schedules**: Management of persisted schedules
- **Preferences**: Configuration options for schedule generation
- **Layout**: Container and layout components

## Component Structure

### Main Components

#### `ScheduleBuilderForm.tsx`

The primary form component that orchestrates the entire schedule building process.

**Features:**

- Form management with react-hook-form and zod validation
- Schedule generation from selected sections
- Schedule saving and updating capabilities
- Navigation between different schedule builder tabs
- Error handling and user feedback via toast notifications
- Real-time preference updates synced with Redux store

**Key Functions:**

- `handleBuildSchedule()`: Generates schedules from selected sections
- `handleSaveSchedule()`: Saves or updates the current schedule
- Form validation and error handling

#### `TimeConflictsPopup.tsx`

Modal component for handling schedule time conflicts.

**Features:**

- Automatic detection of time conflicts in current schedule
- Manual conflict resolution option (opens conflict editor)
- Automatic conflict resolution by fetching alternative sections
- Smooth animations for popup appearance/disappearance
- Error handling for API calls

**Key Functions:**

- `editManually()`: Opens the conflict editor interface
- `autoResolve()`: Automatically resolves conflicts by finding alternative sections

### Selected Sections Management

#### `SectionsChosen.tsx`

Main component for displaying and managing selected course sections.

**Features:**

- Groups sections by course ID and professor
- Conflict detection and visualization
- Add/remove entire courses from schedule
- Term validation and switching
- Class pair handling (labs/lectures)
- Professor rating display
- Empty state handling
- Bulk selection/deselection options

#### `SectionCard.tsx`

Individual section display and management component.

**Features:**

- Comprehensive section information display
- Add/remove from schedule functionality
- Section selection for schedule building
- Visibility toggling (hide/show sections)
- Conflict detection and highlighting
- Term validation and switching
- Class pair handling (labs/lectures)
- Time and day display
- Professor information
- Color-coded course identification

#### `CourseAccordion.tsx`

Collapsible component for displaying course sections grouped by professor.

**Features:**

- Collapsible accordion interface for course sections
- Professor-based grouping with ratings
- Conflict detection and highlighting
- Automatic expansion for conflict resolution
- Smooth scroll to expanded sections
- Add/remove entire courses from schedule
- Section visibility toggling
- Color-coded course identification

#### `ProfessorCollapsibleTrigger.tsx`

Component for managing professor-specific section groups.

#### `SelectOrDeselectAllSections.tsx`

Bulk selection/deselection interface for sections.

#### `SelectedSectionContainer.tsx`

Container component for the selected sections area.

#### `EmptySelectedSectionts.tsx`

Empty state component when no sections are selected.

### Saved Schedules Management

#### `SavedSchedules.tsx`

Component for displaying and managing saved schedules.

**Features:**

- Displays list of saved schedules with names and timestamps
- Primary schedule indicator with pin icon
- Schedule selection and navigation
- Responsive design for mobile and desktop
- Smooth animations for list items
- Empty state handling
- Current schedule highlighting
- Schedule options menu on hover

#### `ScheduleOptions.tsx`

Popover component for managing individual schedule options.

**Features:**

- Schedule name editing with input field
- Primary schedule toggle with switch control
- Schedule deletion with confirmation
- Automatic navigation after deletion
- Form validation and error handling
- Popover-based interface for compact design

### Preferences Management

#### `Preferences.tsx`

Component for managing schedule building preferences.

**Features:**

- Unit range slider (0-24 units, default 4-16)
- Instructor rating slider for schedule average
- Toggle for open classes only
- Toggle for including time conflicts
- Form validation and error handling
- Responsive design

### Layout Components

#### `BuildScheduleContainer.tsx`

Layout container for the schedule builder interface.

**Features:**

- Responsive height calculation (calc(100vh-12rem))
- Scrollable content area with proper overflow handling
- Automatic scroll to bottom on trigger
- Viewport ID management for external scroll control
- Card-based layout with shadow and border styling
- Animation wrapper integration

#### `LeftScheduleFooter.tsx`

Footer component for schedule builder with responsive layout.

**Features:**

- Responsive layout that adapts to container width
- Sticky positioning at the bottom of the container
- Backdrop blur effect for modern UI appearance
- Automatic layout switching based on available space
- Shadow effects for visual depth
- Dark mode support

#### `MobileBuildScheduleContainer.tsx`

Mobile-specific container component.

#### `LoadingContainer.tsx`

Loading state container component.

### Utility Components

#### `utils.ts`

Utility functions for the selected sections components.

**Functions:**

- `adjustColorBrightness()`: Adjusts color brightness for hover effects

## Key Features

### Schedule Generation

- **Conflict Detection**: Automatically identifies time conflicts between sections
- **Preference-Based Generation**: Uses user preferences to generate optimal schedules
- **Multiple Combinations**: Generates all possible valid schedule combinations
- **Rating Optimization**: Considers instructor ratings in schedule generation

### Section Management

- **Grouping**: Sections are grouped by course and professor for better organization
- **Selection**: Individual sections can be selected/deselected for schedule building
- **Visibility**: Sections can be hidden/shown to reduce clutter
- **Validation**: Term matching and class pair validation

### Schedule Persistence

- **Save/Load**: Schedules can be saved and loaded from the database
- **Primary Schedule**: Users can set a primary schedule for quick access
- **Version Control**: Schedule updates are tracked with timestamps
- **Navigation**: Seamless navigation between saved schedules

### User Experience

- **Responsive Design**: Adapts to different screen sizes and devices
- **Smooth Animations**: Framer Motion animations for better UX
- **Error Handling**: Comprehensive error handling with user feedback
- **Loading States**: Proper loading indicators for async operations
- **Accessibility**: Keyboard navigation and screen reader support

## State Management

The components use Redux for state management with the following key slices:

- **schedule**: Current schedule, preferences, and saved schedules
- **sectionSelection**: Selected sections and sections for schedule building
- **layout**: UI state for animations and scroll behavior

## Dependencies

### Core Dependencies

- **React Hook Form**: Form management and validation
- **Zod**: Schema validation
- **Framer Motion**: Animations and transitions
- **Redux Toolkit**: State management
- **React Router**: Navigation

### UI Dependencies

- **Radix UI**: Accessible UI primitives
- **Lucide React**: Icons
- **Tailwind CSS**: Styling

### Custom Hooks

- **useAutoExpand**: Auto-expansion behavior for accordions
- **useIsNarrowScreen**: Responsive design detection
- **useDeviceType**: Device type detection

## Usage Examples

### Basic Schedule Builder Setup

```tsx
import { ScheduleBuilderForm } from "./buildSchedule";

function ScheduleBuilderPage() {
  const handleSwitchTab = (tab: string) => {
    // Handle tab switching
  };

  return <ScheduleBuilderForm onSwitchTab={handleSwitchTab} />;
}
```

### Custom Preferences Configuration

```tsx
import { Preferences } from "./buildSchedule/preferences";

function PreferencesSection() {
  const form = useForm<SchedulePreferencesForm>({
    resolver: zodResolver(SCHEDULE_PREFERENCES_SCHEMA),
    defaultValues: preferences,
  });

  return <Preferences form={form} />;
}
```

### Saved Schedules Management

```tsx
import { SavedSchedules } from "./buildSchedule/savedSchedules";

function SavedSchedulesSection() {
  return <SavedSchedules onSwitchTab={handleSwitchTab} />;
}
```

## Best Practices

### Performance

- Use React.memo for expensive components
- Implement proper key props for lists
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

- **Advanced Conflict Resolution**: More sophisticated conflict resolution algorithms
- **Schedule Templates**: Pre-configured schedule templates
- **Batch Operations**: Bulk operations for multiple schedules
- **Export Options**: Export schedules to various formats
- **Collaboration**: Share schedules with other users

### Technical Improvements

- **Performance Optimization**: Virtual scrolling for large section lists
- **Offline Support**: Offline schedule management
- **Real-time Updates**: Live updates for schedule changes
- **Advanced Analytics**: Schedule usage analytics and insights
