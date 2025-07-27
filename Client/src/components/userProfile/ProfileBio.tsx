/**
 * Props for the ProfileBio component
 * @interface ProfileBioProps
 * @property {string} bio - The user's bio text to display
 * @property {() => void} handleSave - Function to handle saving the bio (currently unused in component)
 */
interface ProfileBioProps {
  bio: string;
  handleSave: () => void;
}

/**
 * ProfileBio Component
 *
 * Displays a user's bio in a centered, styled format with quotation marks.
 * Shows a placeholder message when no bio is provided.
 *
 * @component
 * @param {ProfileBioProps} props - Component props
 * @param {string} props.bio - The user's bio text to display
 * @param {() => void} props.handleSave - Function to handle saving the bio
 *
 * @example
 * ```tsx
 * <ProfileBio
 *   bio="Passionate computer science student interested in AI and web development"
 *   handleSave={() => console.log('Bio saved')}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <ProfileBio
 *   bio=""
 *   handleSave={() => console.log('Bio saved')}
 * />
 * // Displays: "Write something about yourself..."
 * ```
 *
 * @features
 * - Centered layout with proper spacing
 * - Quotation marks around bio text
 * - Placeholder text when bio is empty
 * - Responsive design
 * - Italic styling for bio text
 *
 * @styling
 * - Tailwind CSS classes for responsive design
 * - Inter font family for typography
 * - Gray color scheme (text-gray-500)
 * - Italic styling for emphasis
 * - Proper line height and letter spacing
 * - Centered text alignment
 *
 * @accessibility
 * - Semantic HTML structure
 * - Clear visual hierarchy
 * - Proper contrast ratios
 * - Readable font size and spacing
 *
 * @typography
 * - Font family: Inter
 * - Font size: text-2xl (24px)
 * - Line height: leading-relaxed
 * - Letter spacing: tracking-tight
 * - Font style: italic
 */
const ProfileBio = ({ bio }: ProfileBioProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex items-center justify-center">
        <p className="text-2xl text-center font-inter text-gray-500 leading-relaxed tracking-tight italic px-4">
          &quot;{bio || "Write something about yourself..."}&quot;
        </p>
      </div>
    </div>
  );
};

export default ProfileBio;
