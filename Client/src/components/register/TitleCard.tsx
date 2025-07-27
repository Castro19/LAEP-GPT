/**
 * @component TitleCard
 * @description Decorative title card component with gradient background and SVG decorations.
 * Displays title and description with responsive design.
 *
 * @props
 * @prop {string} title - Main title text to display
 * @prop {string} description - Description text below title
 *
 * @dependencies
 * - useIsNarrowScreen: Responsive design hook
 * - SVG: Decorative background elements
 *
 * @features
 * - Gradient background styling
 * - Decorative SVG elements
 * - Responsive text sizing
 * - Dark mode support
 * - Responsive padding and layout
 * - Z-index layering
 *
 * @example
 * ```tsx
 * <TitleCard
 *   title="Welcome"
 *   description="Get started with your account"
 * />
 * ```
 */

import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";

// TitleCard.tsx
type TitleCardProps = {
  title: string;
  description: string;
};

const TitleCard = ({ title, description }: TitleCardProps) => {
  const isNarrowScreen = useIsNarrowScreen();

  return (
    <div className="relative w-full h-full">
      {/* Subtle decorative SVGs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none select-none overflow-hidden">
        <svg
          className="absolute w-[300px] h-[300px] text-slate-300 opacity-[0.03] top-[-50px] right-[-50px] md:w-[300px] md:h-[300px] sm:w-[200px] sm:h-[200px]"
          fill="currentColor"
          viewBox="0 0 512 512"
        >
          <path d="M0 0L512 128L512 0L0 0Z" />
        </svg>
        <svg
          className="absolute w-[200px] h-[200px] text-slate-300 opacity-[0.02] bottom-[-30px] left-[-30px] md:w-[200px] md:h-[200px] sm:w-[150px] sm:h-[150px]"
          fill="currentColor"
          viewBox="0 0 512 512"
        >
          <rect x="0" y="0" width="512" height="512" />
        </svg>
      </div>

      {/* Main content */}
      <div
        className={`${
          isNarrowScreen ? "w-full" : "w-full h-full"
        } relative z-10 flex flex-col justify-center items-start bg-gradient-to-br from-zinc-800/95 via-zinc-800 to-slate-800 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-white p-4 sm:p-6 md:p-8 border-b border-slate-600/50`}
      >
        <div className="max-w-md">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4">
            {title}
          </h1>
          <p className="text-base sm:text-lg text-slate-200/90">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TitleCard;
