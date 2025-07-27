# Course Filters

## Overview

Comprehensive filtering system for class search using React Hook Form with Zod validation. Components filter course sections by course info, scheduling, instructor ratings, and AI queries.

## Components

### SectionFilters

- Container component orchestrating all filter sections
- Renders CourseInformation, Scheduling, Instructor, QueryAI with visual separators
- Manages form state via React Hook Form

### SectionForm

- Primary form wrapper with Redux integration
- Handles form submission, API query building, form reset
- Converts form data to API-compatible format
- Responsive design for mobile/desktop

### CourseInformation

- Term selection dropdown
- Course search with deletable tags
- Subject dropdown (all academic subjects)
- Catalog number range slider (100-600)
- Unit range slider (0-9)
- Course attributes multi-select (GE A-D, GWR, USCP)
- Technical elective handling with major/concentration
- Credit/No Credit toggle

### Scheduling

- Days selector (Mo, Tu, We, Th, Fr) with multi-select
- Time range picker (24-hour format)
- Enrollment status toggles (Open, Waitlist, Closed)
- Instruction mode buttons (In-Person, Async, Sync, Hybrid)
- No conflicts toggle with schedule builder integration

### Instructor

- Instructor rating range slider (min/max)
- Include unrated instructors toggle
- Instructor search with autocomplete
- Selected instructors with deletable tags

### QueryAI

- Natural language course search
- Animated placeholder suggestions
- Query explanation display
- Error handling and loading states
- Menu integration for mobile

## Helper Components

### DaysSelector

- Multi-select component for class days
- Visual day representation with checkboxes

### CatalogNumberSlider

- Range slider for course catalog numbers
- Configurable min/max values

### TimeRange

- Dual time selector for start/end times
- 24-hour format with user-friendly labels

## API Integration

### fetchProfessors

- API helper for instructor search functionality

### subjects

- Static data containing all academic subjects

## State Management

- **Redux**: Filter persistence, API state, loading states, user preferences
- **React Hook Form**: Form validation, real-time updates, efficient rendering
- **Zod**: Type-safe schema validation

## Key Features

- Real-time filter application
- AI-powered natural language search
- Form validation with Zod schemas
- State persistence across sessions
- Responsive design
- Schedule builder integration
- Technical elective handling

## Data Flow

1. User selects filter criteria → Form state updates → Redux sync → API query → Results
2. AI query → Natural language processing → Structured filters → Results
3. Form reset → Clear all filters → Default state → Fresh search
