# UserProfile Components

This folder contains React components for managing and displaying user profile information in the LAEP-GPT application.

## Components Overview

### ProfileEmptyState

Displays an empty state message when users have no flowcharts or schedules, with call-to-action buttons to create new content.

**Key Features:**

- Responsive centered layout
- Icon/illustration support
- Navigation to creation pages
- Redux state management integration
- Dark mode support

**Props:**

- `title`: Main title for the empty state
- `description`: Descriptive text explaining the empty state
- `icon`: Icon or illustration to display
- `type`: Type of content to create ("flowchart" | "schedule-builder")

**Usage:**

```tsx
<ProfileEmptyState
  title="No Flowcharts Yet"
  description="Create your first flowchart to visualize your academic path"
  icon={<FlowchartIcon />}
  type="flowchart"
/>
```

### Interest

Displays user interest areas as interactive tags with hover animations.

**Key Features:**

- Responsive flex layout with wrapping
- Hover animations (scale and translate effects)
- Color transitions on hover
- Conditional placeholder display
- Centered layout for tags

**Props:**

- `interestAreas`: Array of interest areas to display
- `placeholder`: Whether to show "N/A" when no interests are provided (default: true)

**Usage:**

```tsx
<Interest
  interestAreas={["Computer Science", "AI", "Web Development"]}
  placeholder={true}
/>
```

### ProfileBio

Displays a user's bio in a centered, styled format with quotation marks.

**Key Features:**

- Centered layout with proper spacing
- Quotation marks around bio text
- Placeholder text when bio is empty
- Responsive design
- Italic styling for bio text

**Props:**

- `bio`: The user's bio text to display
- `handleSave`: Function to handle saving the bio

**Usage:**

```tsx
<ProfileBio
  bio="Passionate computer science student interested in AI and web development"
  handleSave={() => console.log("Bio saved")}
/>
```

### UserAvatar

Displays a clickable user avatar that navigates to the profile edit page.

**Key Features:**

- Clickable avatar with hover effects
- Automatic navigation to profile edit page
- Authentication state checking
- Error message display for unauthenticated users
- Loading state handling
- User initials fallback

**Usage:**

```tsx
<UserAvatar />
```

### UserMenu

Displays user information and authentication controls.

**Key Features:**

- Conditional rendering based on authentication state
- User avatar and name display for authenticated users
- Login and signup buttons for unauthenticated users
- Responsive design with proper spacing
- Fixed bottom positioning for auth buttons
- Dark mode support

**Usage:**

```tsx
<UserMenu />
```

## Dependencies

### External Libraries

- **react**: React hooks and event handling
- **react-router-dom**: Navigation functionality
- **@/redux**: Redux state management

### Internal Components

- **@/components/ui/avatar**: Avatar UI components
- **@/components/ui/button**: Button components

## State Management

### Redux Integration

- **auth**: Authentication state (userLoggedIn, loading)
- **user**: User data (userData, name)
- **schedule**: Schedule state management for creation

### Local State

- Error messages for unauthenticated users
- Loading states

## Styling

### Design System

- **Tailwind CSS**: Responsive design and utility classes
- **Dark Mode**: Support with dark: variants
- **Inter Font**: Typography for bio text

### Common Patterns

- Centered layouts with flexbox
- Hover effects and smooth transitions
- Rounded corners and proper spacing
- Responsive text handling

## Accessibility

### Features

- Semantic HTML structure
- Clear visual hierarchy
- Proper contrast ratios
- Descriptive button text
- Loading state indication
- Error messages for unauthenticated users

### Best Practices

- Use proper heading hierarchy
- Provide alternative text for icons
- Ensure keyboard navigation
- Maintain color contrast ratios

## Usage Examples

### Complete Profile Display

```tsx
import { ProfileBio, Interest, UserAvatar } from "./userProfile";

function UserProfile() {
  return (
    <div className="profile-container">
      <UserAvatar />
      <ProfileBio bio={userBio} handleSave={handleSaveBio} />
      <Interest interestAreas={userInterests} />
    </div>
  );
}
```

### Authentication-Aware Menu

```tsx
import { UserMenu } from "./userProfile";

function Header() {
  return (
    <header>
      <UserMenu />
    </header>
  );
}
```

### Empty State Handling

```tsx
import { ProfileEmptyState } from "./userProfile";

function FlowchartPage() {
  if (flowcharts.length === 0) {
    return (
      <ProfileEmptyState
        title="No Flowcharts Yet"
        description="Create your first flowchart to visualize your academic path"
        icon={<FlowchartIcon />}
        type="flowchart"
      />
    );
  }

  return <FlowchartList flowcharts={flowcharts} />;
}
```

## Best Practices

### Component Usage

1. Always provide meaningful props for empty states
2. Handle loading and error states appropriately
3. Use proper TypeScript interfaces for props
4. Implement responsive design patterns

### State Management

1. Use Redux for global state (auth, user data)
2. Use local state for component-specific data
3. Handle authentication state changes properly
4. Provide fallback values for optional data

### Styling

1. Use Tailwind CSS utility classes consistently
2. Implement dark mode support where appropriate
3. Ensure responsive design across screen sizes
4. Maintain consistent spacing and typography

## Future Enhancements

### Planned Features

- Profile image upload functionality
- Real-time bio editing
- Interest area management interface
- Enhanced avatar customization
- Profile completion indicators

### Potential Improvements

- Add profile picture upload capability
- Implement bio editing with auto-save
- Add interest area suggestions
- Enhance accessibility features
- Add profile analytics

## Testing

### Component Testing

- Test authentication state changes
- Verify navigation functionality
- Test responsive design behavior
- Validate error handling
- Test loading states

### Integration Testing

- Test Redux state integration
- Verify routing functionality
- Test user data flow
- Validate form submissions

## Contributing

When contributing to userProfile components:

1. Follow the existing JSDoc documentation pattern
2. Maintain consistent prop interfaces
3. Add appropriate TypeScript types
4. Include accessibility considerations
5. Test responsive behavior
6. Update this README for new components
