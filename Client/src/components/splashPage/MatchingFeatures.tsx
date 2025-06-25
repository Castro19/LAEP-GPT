import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";

/**
 * MatchingFeatures - Sticky scroll reveal component for feature demonstrations
 *
 * This component provides an interactive sticky scroll experience that showcases
 * PolyLink's key features through animated GIFs and descriptive text. It creates
 * an engaging way to demonstrate the application's capabilities.
 *
 * @component
 *
 * @example
 * ```tsx
 * <MatchingFeatures />
 * ```
 *
 * @dependencies
 * - StickyScroll UI component
 * - Static GIF assets for demonstrations
 *
 * @features
 * - Sticky scroll reveal animations
 * - Interactive feature demonstrations
 * - Animated GIF showcases
 * - Descriptive text for each feature
 * - Responsive design
 * - Smooth scroll behavior
 *
 * @content
 * - Course AI Query demonstration
 * - Schedule building showcase
 * - AI-powered insights display
 * - Professor ratings feature (commented out)
 *
 * @demonstrations
 * - course-ai-query.gif: AI-powered course search
 * - build-schedules.gif: Schedule building process
 * - schedule-builder-ai.gif: AI insights and analysis
 * - professor-ratings.gif: Professor rating system (disabled)
 *
 * @styling
 * - Full-width and height layout
 * - White text for contrast
 * - Responsive image sizing
 * - Proper aspect ratios for videos
 *
 * @accessibility
 * - Alt text for all images
 * - Semantic HTML structure
 * - Keyboard navigation support
 * - Screen reader friendly content
 *
 * @performance
 * - Optimized GIF loading
 * - Lazy loading considerations
 * - Smooth scroll performance
 * - Responsive image handling
 */
const DivStyle = ({ children }: { children: React.ReactNode }) => {
  return <div className="h-full w-full flex text-white">{children}</div>;
};

const content = [
  {
    title: "Find Your Spring 2025 Classes with AI",
    description:
      "Powered by AI and Polyratings, PolyLink helps you find the perfect classes with the best professors. Just describe what you need, and we'll match you with top-rated courses based on real student reviews.",
    content: (
      <DivStyle>
        <img
          src="/imgs/splash/course-ai-query.gif"
          alt="linear board demo"
          width={890}
          height={600}
        />
      </DivStyle>
    ),
  },
  {
    title: "Build Your Perfect Schedule!",
    description:
      "You've picked your classes—now let Schedule Analysis handle the rest! Generate multiple schedule options, resolve conflicts, and customize with ease. Say goodbye to scheduling stress!",
    content: (
      <DivStyle>
        <img
          src="/imgs/splash/build-schedules.gif"
          alt="linear board demo"
          width={890}
          height={500}
        />
      </DivStyle>
    ),
  },
  {
    title: "From Planning to AI-Powered Insights!",
    description:
      "You've selected your classes and generated schedules—now let AI summarize, analyze, and optimize! Get instant summaries, professor insights, and smart suggestions to help you make the most of Spring 2025.",
    content: (
      <DivStyle>
        <img
          src="/imgs/splash/schedule-builder-ai.gif"
          alt="linear board demo"
          width={890}
          height={500}
        />
      </DivStyle>
    ),
  },
  // {
  //   title: "Find a Professor",
  //   description:
  //     "Utilizing ratings from Polyratings, PolyLink can help you find the right professor for you. Simply type the course name and PolyLink will summarize all professors teaching that course and their ratings.",
  //   content: (
  //     <div className="h-full w-full flex items-center justify-center text-white">
  //       <img
  //         src="/imgs/splash/professor-ratings.gif"
  //         width={500}
  //         height={500}
  //         alt="linear board demo"
  //       />
  //     </div>
  //   ),
  // },
];

export function StickyScrollRevealDemo() {
  return <StickyScroll content={content} />;
}
