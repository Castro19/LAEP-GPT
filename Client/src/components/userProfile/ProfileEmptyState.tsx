import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { scheduleActions, useAppDispatch } from "@/redux";

/**
 * Props for the ProfileEmptyState component
 * @interface ProfileEmptyStateProps
 * @property {string} title - The main title displayed in the empty state
 * @property {string} description - Descriptive text explaining the empty state
 * @property {React.ReactNode} icon - Icon or illustration to display
 * @property {"flowchart" | "schedule-builder"} type - Type of content to create when button is clicked
 */
type ProfileEmptyStateProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  type: "flowchart" | "schedule-builder";
};

/**
 * ProfileEmptyState Component
 *
 * Displays an empty state message when a user has no flowcharts or schedules.
 * Provides a call-to-action button to create new content based on the type.
 *
 * @component
 * @param {ProfileEmptyStateProps} props - Component props
 * @param {string} props.title - Main title for the empty state
 * @param {string} props.description - Description text explaining the empty state
 * @param {React.ReactNode} props.icon - Icon or illustration to display
 * @param {"flowchart" | "schedule-builder"} props.type - Type of content to create
 *
 * @example
 * ```tsx
 * <ProfileEmptyState
 *   title="No Flowcharts Yet"
 *   description="Create your first flowchart to visualize your academic path"
 *   icon={<FlowchartIcon />}
 *   type="flowchart"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <ProfileEmptyState
 *   title="No Schedules Built"
 *   description="Start building your class schedule for the upcoming term"
 *   icon={<CalendarIcon />}
 *   type="schedule-builder"
 * />
 * ```
 *
 * @dependencies
 * - react-router-dom: For navigation functionality
 * - @/redux: For Redux state management and actions
 * - ../ui/button: For the call-to-action button
 *
 * @features
 * - Responsive design with centered layout
 * - Dark mode support
 * - Navigation to appropriate creation pages
 * - Redux state management for schedule creation
 * - Hover effects and smooth transitions
 *
 * @state
 * - Uses Redux for schedule state management
 * - Uses React Router for navigation
 *
 * @accessibility
 * - Semantic HTML structure
 * - Clear visual hierarchy
 * - Descriptive button text
 *
 * @styling
 * - Tailwind CSS classes for responsive design
 * - Dark mode support with dark: variants
 * - Centered layout with proper spacing
 * - Rounded corners and proper padding
 */
const ProfileEmptyState = ({
  title,
  description,
  icon,
  type,
}: ProfileEmptyStateProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  /**
   * Handles the click event for creating new content
   * Navigates to the appropriate page based on the type
   */
  const handleClick = () => {
    if (type === "flowchart") {
      navigate("/flowchart");
    } else if (type === "schedule-builder") {
      dispatch(scheduleActions.setCurrentScheduleId(undefined));
      navigate("/schedule-builder");
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-6 dark:bg-transparent rounded-lg">
      <div className="max-w-md text-center space-y-6">
        {/* Icon/Illustration */}
        <div className="flex justify-center">
          <div className="w-32 h-32 dark:bg-slate-800 rounded-full flex items-center justify-center">
            {icon}
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <h3 className="text-4xl font-semibold text-gray-400">{title}</h3>
          <p className="text-gray-200 text-lg">{description}</p>
        </div>
        <Button onClick={handleClick}>Create a {type}</Button>
      </div>
    </div>
  );
};

export default ProfileEmptyState;
