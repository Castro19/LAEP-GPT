import ComingSoonPage from "@/pages/ComingSoonPage";
import { useAppSelector } from "@/redux";
import React from "react";

/**
 * AdminViewOnly - Component for restricting content to admin users only
 *
 * This component provides admin-only access control by checking the user's
 * userType and either rendering the children components or showing a
 * "Coming Soon" page for non-admin users.
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render for admin users
 *
 * @example
 * ```tsx
 * <AdminViewOnly>
 *   <AdminDashboard />
 *   <UserManagement />
 * </AdminViewOnly>
 * ```
 *
 * @dependencies
 * - Redux store for user state
 * - ComingSoonPage for non-admin user display
 * - React for component rendering
 *
 * @features
 * - Admin-only content rendering
 * - Automatic fallback to ComingSoonPage for non-admins
 * - User type-based access control
 * - Seamless integration with existing components
 * - No additional styling or layout changes
 *
 * @accessControl
 * - Checks userData.userType for admin status
 * - Renders children only for admin users
 * - Shows ComingSoonPage for non-admin users
 * - Maintains component hierarchy and props
 *
 * @userTypes
 * - admin: Can view protected content
 * - non-admin: Sees ComingSoonPage
 * - undefined/null: Sees ComingSoonPage
 *
 * @styling
 * - No additional styling applied
 * - Relies on child components for styling
 * - ComingSoonPage handles its own styling
 * - Consistent with application theme
 *
 * @security
 * - Prevents non-admin users from accessing admin content
 * - Maintains user type-based access control
 * - Provides graceful fallback for unauthorized access
 * - No sensitive information exposure to non-admins
 *
 * @usage
 * - Wrap admin-only components or pages
 * - Use in route configurations for admin routes
 * - Apply to individual components that need admin access
 * - Combine with other security components for layered protection
 */
const AdminViewOnly = ({ children }: { children: React.ReactNode }) => {
  const { userData } = useAppSelector((state) => state.user);

  if (userData.userType !== "admin") {
    return <ComingSoonPage />;
  }
  return children;
};

export default AdminViewOnly;
