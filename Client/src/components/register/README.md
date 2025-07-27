# Register Components

## Overview

Components for user registration and authentication flow. Provides multi-step sign-in process, user information collection, and account setup functionality.

## Components

### LoginBanner

- Microsoft login availability notice
- Alternative sign-up link
- Warning styling with yellow theme
- Responsive design

### WeeklyCalendar

- Interactive weekly availability calendar
- Time slot selection (8 AM - 8 PM)
- Drag functionality for bulk selection
- Read-only mode support
- Visual feedback for selected slots

### TitleCard

- Decorative title card with gradient background
- SVG decorative elements
- Responsive text sizing
- Dark mode support

### ErrorMessage

- Error alert component
- Destructive styling (red background)
- White text for contrast
- Alert icon display

## SignInFlow Components

### SignInFlow (index)

- Main sign-in flow container
- Multi-step registration (5 steps)
- Device-responsive layout selection
- Step navigation and validation

### BasicInformation

- Starting year selection (2019-2025)
- Current year selection (freshman to graduate)
- Major selection from predefined list
- Form validation and state management

### Demographics

- Demographic information collection
- Age, gender, ethnicity selection
- Privacy-focused data collection

### Interests

- User interest selection
- Interest categories and tags
- Personalized recommendations setup

### Terms

- Terms of service acceptance
- Privacy policy display
- Legal agreement handling

### InputInformation

- Profile personalization choice
- Now or later option
- User preference selection

### AboutMe

- Personal information collection
- Bio and description fields
- Profile customization

### InterestDropdown

- Interest selection interface
- Categorized interest options
- Multi-select functionality

### MobileSignInFlow

- Mobile-optimized sign-in layout
- Touch-friendly interface
- Responsive design

### DesktopSignInFlow

- Desktop-optimized sign-in layout
- Sidebar navigation
- Enhanced user experience

## Features

- Multi-step registration process
- Device-responsive layouts
- Form validation and state management
- User data collection and storage
- Terms acceptance handling
- Error handling and notifications
- Smooth animations and transitions
- Accessibility support

## State Management

- **Redux**: authActions, user state, flowSelection
- **useUserData**: User data management hook
- **Local State**: Form data, step navigation

## Data Flow

1. User registration → Multi-step flow → Data collection → Account creation
2. Form validation → State updates → Database persistence → UI feedback
3. Device detection → Layout selection → Responsive rendering

## Dependencies

- React Router for navigation
- Redux for state management
- Framer Motion for animations
- UI components (Card, Button, Alert)
- Responsive design hooks
- Form validation libraries
