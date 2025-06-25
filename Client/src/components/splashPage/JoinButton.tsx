import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/**
 * JoinButton - Call-to-action button for user registration
 *
 * This component provides a prominent call-to-action button that encourages
 * users to join PolyLink. It features animated hover effects, gradient styling,
 * and navigation to the registration page.
 *
 * @component
 *
 * @example
 * ```tsx
 * <JoinButton />
 * ```
 *
 * @dependencies
 * - React Router for navigation
 * - Framer Motion for animations
 *
 * @features
 * - Animated hover and tap effects
 * - Gradient background with hover states
 * - Animated arrow indicator
 * - Spring-based animations
 * - Shadow effects with hover enhancement
 * - Navigation to registration page
 *
 * @animations
 * - Scale and position hover effects
 * - Tap animation for feedback
 * - Entrance animation with fade and slide
 * - Animated arrow movement
 * - Gradient overlay on hover
 *
 * @styling
 * - Gradient backgrounds (slate colors)
 * - Shadow effects with hover enhancement
 * - Ring borders with hover states
 * - Responsive design
 * - Custom button dimensions
 *
 * @navigation
 * - Routes to "/register/login" on click
 * - Uses React Router navigation
 * - Maintains browser history
 *
 * @accessibility
 * - Proper button semantics
 * - Keyboard navigation support
 * - Screen reader friendly text
 * - Focus management
 * - Clear call-to-action text
 *
 * @content
 * - Primary text: "Get Started Now"
 * - Animated arrow: →
 * - Hover gradient overlay
 * - Drop shadow for text
 */
// Add this at the top of your component
const buttonVariants = {
  hover: {
    scale: 1.05,
    y: -3,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10,
    },
  },
  tap: {
    scale: 0.95,
  },
  initial: {
    y: 20,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const JoinButton = () => {
  const navigate = useNavigate();

  return (
    // Modified Button component
    <motion.button
      onClick={() => navigate("/register/login")}
      variants={buttonVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      className="
    min-w-[220px] text-white text-2xl font-black
    px-8 py-6 mt-8 rounded-2xl
    bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800
    hover:bg-gradient-to-br hover:from-slate-500 hover:via-slate-600 hover:to-slate-700
    transform transition-all duration-300
    shadow-2xl shadow-slate-900/40
    hover:shadow-3xl hover:shadow-slate-900/50
    relative overflow-hidden
    ring-2 ring-slate-600/20
    hover:ring-slate-500/40
  "
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-300 bg-gradient-to-r from-white/30 to-transparent" />

      {/* Button content with animated arrow */}
      <div className="flex items-center justify-center space-x-3">
        <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.2)]">
          Get Started Now
        </span>
        <motion.span
          animate={{ x: [0, 4, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
          className="text-xl"
        >
          →
        </motion.span>
      </div>
    </motion.button>
  );
};

export default JoinButton;
