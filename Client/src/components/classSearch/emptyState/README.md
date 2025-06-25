# Empty State Components

## Overview

Components for handling different states when no course sections are displayed. Provides user guidance, loading indicators, and error states with smooth animations.

## Components

### InitialSectionState

- Welcome screen for first-time users
- AI search feature promotion with clickable link
- Important disclaimers about data accuracy
- Service information and update schedules
- Smooth entrance animations

### NoSectionsFound

- Displayed when search returns no results
- Shows active filters with formatted values
- Filter value formatting (time ranges, arrays, booleans)
- Instruction mode mapping (P → In-Person, A → Asynchronous)
- Guidance for adjusting search criteria

### SectionLoading

- Loading indicator while fetching sections
- Animated bouncing dots with staggered delays
- Loading text with fade-in animation
- Dark/light mode color support
- Smooth entrance/exit transitions

## Features

- User-friendly empty states
- Active filter display and formatting
- AI feature promotion
- Service disclaimers and information
- Smooth animations with Framer Motion
- Responsive design
- Dark/light mode support

## State Management

- **Redux**: classSearch filters, layoutActions for AI menu
- **Local State**: Animation states, loading indicators

## Data Flow

1. Initial state → Welcome screen → AI promotion → User action
2. No results → Filter analysis → Formatted display → User guidance
3. Loading → Animated dots → Loading text → Results display

## Dependencies

- Framer Motion for animations
- Card UI components
- React Icons
- Redux state management
- Class name utilities
