# Security Components

This folder contains security and access control components for the Client side of PolyLink. These components provide authentication, authorization, and route protection functionality to ensure secure access to different parts of the application.

## Overview

The security system consists of three main components:

- **ProtectedRoute**: Route protection for authenticated users
- **NewUserRoute**: Route handling for new user onboarding
- **AdminViewOnly**: Admin-only content access control

## Component Structure

### Route Protection Components

#### `ProtectedRoute.tsx`

Route protection component for authenticated users.

**Features:**

- Authentication state checking
- Email verification enforcement
- New user onboarding flow enforcement
- Loading state handling
- Automatic redirects based on user state
- Child route rendering with Outlet

**Authentication Flow:**

- Checks if user is logged in
- Verifies email verification status
- Ensures new users complete onboarding
- Redirects to appropriate pages based on state

**Redirects:**

- Unauthenticated users → "/" (home page)
- Unverified email → "/verify-email"
- New users → "/sign-in-flow/terms"
- Authenticated users → Child routes via Outlet

**Usage:**

```tsx
// In router configuration
<Route path="/protected" element={<ProtectedRoute />}>
  <Route path="dashboard" element={<Dashboard />} />
  <Route path="profile" element={<Profile />} />
</Route>
```

#### `NewUserRoute.tsx`

Route component for new user onboarding flow.

**Features:**

- New user onboarding flow management
- Authentication state checking
- Admin user special handling
- Loading state handling
- Automatic redirects based on user state
- SignInFlow component rendering

**User Flow:**

- Checks if user is logged in
- Determines if user is new or existing
- Handles admin users differently
- Redirects to appropriate destinations
- Renders onboarding flow for new users

**Redirects:**

- Unauthenticated users → "/register/login"
- Existing non-admin users → "/chat"
- New users → SignInFlow component
- Admin users → SignInFlow component (special handling)

**Usage:**

```tsx
// In router configuration
<Route path="/sign-in-flow" element={<NewUserRoute />} />
```

### Access Control Components

#### `AdminViewOnly.tsx`

Component for restricting content to admin users only.

**Features:**

- Admin-only content rendering
- Automatic fallback to ComingSoonPage for non-admins
- User type-based access control
- Seamless integration with existing components
- No additional styling or layout changes

**Access Control:**

- Checks userData.userType for admin status
- Renders children only for admin users
- Shows ComingSoonPage for non-admin users
- Maintains component hierarchy and props

**User Types:**

- admin: Can view protected content
- non-admin: Sees ComingSoonPage
- undefined/null: Sees ComingSoonPage

**Usage:**

```tsx
<AdminViewOnly>
  <AdminDashboard />
  <UserManagement />
</AdminViewOnly>
```

## Key Features

### Authentication & Authorization

- **Route Protection**: Prevents unauthorized access to protected routes
- **Email Verification**: Enforces email verification requirement
- **User Onboarding**: Ensures new users complete onboarding process
- **Admin Access Control**: Restricts admin features to admin users only
- **Loading States**: Proper loading indicators during authentication checks

### Security Measures

- **State Integrity**: Maintains authentication state integrity
- **Graceful Fallbacks**: Provides appropriate fallbacks for unauthorized access
- **No Information Leakage**: Prevents sensitive information exposure
- **Layered Protection**: Components can be combined for enhanced security

### User Experience

- **Automatic Redirects**: Seamless navigation based on user state
- **Clear Feedback**: Loading states and appropriate error pages
- **Consistent Behavior**: Predictable security behavior across the application
- **Accessible Design**: Maintains accessibility while enforcing security

## State Management

The components use Redux for state management with the following key slices:

- **auth**: Authentication state (userLoggedIn, loading, isNewUser, emailVerified)
- **user**: User data including userType for admin checks

## Dependencies

### Core Dependencies

- **Redux**: State management for authentication and user data
- **React Router**: Navigation and routing functionality
- **React**: Component rendering and hooks

### UI Dependencies

- **ComingSoonPage**: Fallback page for unauthorized access
- **SignInFlow**: Onboarding flow component

## Usage Examples

### Basic Route Protection

```tsx
import { ProtectedRoute } from "./security";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/protected" element={<ProtectedRoute />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
```

### New User Onboarding

```tsx
import { NewUserRoute } from "./security";

function AppRouter() {
  return (
    <Routes>
      <Route path="/sign-in-flow" element={<NewUserRoute />} />
    </Routes>
  );
}
```

### Admin-Only Content

```tsx
import { AdminViewOnly } from "./security";

function AdminPage() {
  return (
    <AdminViewOnly>
      <AdminDashboard />
      <UserManagement />
      <SystemSettings />
    </AdminViewOnly>
  );
}
```

### Combined Security

```tsx
import { ProtectedRoute, AdminViewOnly } from "./security";

function AppRouter() {
  return (
    <Routes>
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route
          index
          element={
            <AdminViewOnly>
              <AdminDashboard />
            </AdminViewOnly>
          }
        />
      </Route>
    </Routes>
  );
}
```

## Security Best Practices

### Authentication

- Always check authentication state before rendering protected content
- Implement proper loading states during authentication checks
- Use secure redirects to prevent unauthorized access
- Maintain session integrity across the application

### Authorization

- Implement role-based access control (RBAC)
- Check user permissions at component level
- Provide appropriate fallbacks for unauthorized access
- Avoid exposing sensitive information in error messages

### Route Protection

- Use nested routes for better security organization
- Implement proper redirect logic for different user states
- Handle edge cases like loading states and error conditions
- Maintain consistent security behavior across routes

### User Experience

- Provide clear feedback for security-related actions
- Implement graceful fallbacks for unauthorized access
- Maintain accessibility while enforcing security
- Use consistent patterns for security components

## Error Handling

### Authentication Errors

- Handle loading states during authentication checks
- Provide appropriate fallbacks for authentication failures
- Implement proper error boundaries for security components
- Log security-related errors for monitoring

### Authorization Errors

- Show appropriate messages for unauthorized access
- Implement graceful degradation for permission failures
- Provide clear guidance for users who need elevated permissions
- Maintain security while providing good user experience

### Network Errors

- Handle network failures during authentication checks
- Implement retry mechanisms for failed authentication requests
- Provide offline fallbacks when possible
- Maintain security state during network issues

## Performance Considerations

### Optimization

- Use React.memo for security components when appropriate
- Implement proper key props for security-related lists
- Optimize re-renders with useMemo and useCallback
- Lazy load security components when possible

### Caching

- Cache authentication state appropriately
- Implement proper cache invalidation for security changes
- Use secure storage for sensitive information
- Avoid caching sensitive data in memory unnecessarily

## Testing

### Unit Testing

- Test authentication state handling
- Verify redirect logic for different user states
- Test admin access control functionality
- Ensure proper error handling

### Integration Testing

- Test complete authentication flows
- Verify route protection behavior
- Test admin-only content access
- Ensure proper state management

### Security Testing

- Test unauthorized access attempts
- Verify proper fallback behavior
- Test authentication bypass attempts
- Ensure no sensitive information leakage

## Future Enhancements

### Planned Features

- **Multi-factor Authentication**: Support for 2FA and MFA
- **Role-based Permissions**: Granular permission system
- **Session Management**: Advanced session handling
- **Audit Logging**: Security event logging and monitoring

### Technical Improvements

- **JWT Integration**: Enhanced token-based authentication
- **OAuth Support**: Third-party authentication providers
- **Permission Groups**: Advanced permission management
- **Security Analytics**: User behavior and security analytics

### User Experience

- **Progressive Security**: Adaptive security based on user behavior
- **Security Notifications**: Real-time security alerts
- **Account Recovery**: Enhanced account recovery options
- **Security Education**: In-app security guidance and tips
