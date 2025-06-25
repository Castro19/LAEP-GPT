import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/**
 * SplashHeaderButton - Brand logo and navigation button for splash page
 *
 * This component provides the PolyLink brand logo as a clickable button that
 * navigates to the home page. It features animated hover effects and gradient
 * text styling for a polished appearance.
 *
 * @component
 *
 * @example
 * ```tsx
 * <SplashHeaderButton />
 * ```
 *
 * @dependencies
 * - React Router for navigation
 * - Framer Motion for animations
 *
 * @features
 * - Brand logo display with gradient text
 * - Animated hover and tap effects
 * - Navigation to home page
 * - Animated dot indicator
 * - Subtle underline animation
 * - Spring-based animations
 *
 * @animations
 * - Scale hover and tap effects
 * - Animated dot with hover states
 * - Fade-in underline animation
 * - Smooth transitions
 * - Spring physics for interactions
 *
 * @styling
 * - Gradient text for brand name
 * - Hover state color changes
 * - Animated dot indicator
 * - Subtle underline effect
 * - Responsive design
 * - Custom typography
 *
 * @navigation
 * - Routes to "/" (home page) on click
 * - Uses React Router navigation
 * - Maintains browser history
 *
 * @branding
 * - Displays "PolyLink" brand name
 * - Consistent with brand identity
 * - Professional appearance
 * - Memorable visual design
 *
 * @accessibility
 * - Proper button semantics
 * - Keyboard navigation support
 * - Screen reader friendly text
 * - Focus management
 * - Clear navigation purpose
 *
 * @content
 * - Brand text: "PolyLink"
 * - Animated dot indicator
 * - Subtle animated underline
 * - Hover gradient changes
 */
const SplashHeaderButton = () => {
  const navigate = useNavigate();
  return (
    <motion.button
      onClick={() => navigate("/")}
      className="relative px-4 py-2.5 group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center space-x-2">
        <span
          className="text-5xl font-black bg-gradient-to-r from-slate-300 to-slate-100 bg-clip-text text-transparent 
                   tracking-tight leading-none font-sans hover:bg-gradient-to-r hover:from-slate-200 hover:to-slate-50
                   transition-all duration-300"
        >
          PolyLink
        </span>
        <motion.span
          className="h-2.5 w-2.5 bg-slate-300 rounded-full opacity-80"
          variants={{
            hover: { scale: 1.1, opacity: 1 },
            tap: { scale: 0.9 },
          }}
        />
      </div>

      {/* Subtle animated underline */}
      <motion.div
        className="absolute bottom-1.5 left-0 w-full h-px bg-gradient-to-r from-slate-200/0 via-slate-200 to-slate-200/0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      />
    </motion.button>
  );
};

export default SplashHeaderButton;
