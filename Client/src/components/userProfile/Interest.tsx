/**
 * Props for the Interest component
 * @interface InterestProps
 * @property {string[]} interestAreas - Array of interest areas to display
 * @property {boolean} [placeholder=true] - Whether to show "N/A" when no interests are provided
 */
interface InterestProps {
  interestAreas: string[];
  placeholder?: boolean;
}

/**
 * Interest Component
 *
 * Displays a list of user interest areas as interactive tags.
 * Shows a placeholder message when no interests are provided.
 *
 * @component
 * @param {InterestProps} props - Component props
 * @param {string[]} props.interestAreas - Array of interest areas to display
 * @param {boolean} [props.placeholder=true] - Whether to show "N/A" when no interests are provided
 *
 * @example
 * ```tsx
 * <Interest
 *   interestAreas={["Computer Science", "AI", "Web Development"]}
 *   placeholder={true}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Interest
 *   interestAreas={[]}
 *   placeholder={false}
 * />
 * ```
 *
 * @features
 * - Responsive flex layout with wrapping
 * - Hover animations with scale and translate effects
 * - Color transitions on hover
 * - Conditional placeholder display
 * - Centered layout for tags
 *
 * @styling
 * - Tailwind CSS classes for responsive design
 * - Hover effects with transform animations
 * - Rounded pill design for interest tags
 * - Gray color scheme with hover state changes
 * - Proper spacing and margins
 *
 * @accessibility
 * - Semantic HTML structure
 * - Clear visual distinction between tags
 * - Proper contrast ratios
 *
 * @animations
 * - Hover scale effect (scale-105)
 * - Hover translate effect (-translate-y-1)
 * - Smooth transitions (duration-300, ease-in-out)
 * - Background color transitions
 */
const Interest = ({ interestAreas, placeholder = true }: InterestProps) => {
  return (
    <div>
      {interestAreas.length > 0 ? (
        <div className="flex flex-wrap justify-center mt-2">
          {interestAreas.map((interest, index) => (
            <span
              key={index}
              className="m-1 px-3 py-1 rounded-full bg-gray-600 text-white text-sm transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:bg-gray-500"
            >
              {interest}
            </span>
          ))}
        </div>
      ) : (
        placeholder && <p className="text-lg text-center">N/A</p>
      )}
    </div>
  );
};

export default Interest;
