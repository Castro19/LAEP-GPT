import { Hero } from "@/components/splashPage/Hero";
import { StickyScrollRevealDemo } from "@/components/splashPage/MatchingFeatures";
import SplashLayout from "@/components/layout/splashPage/SplashLayout";
import JoinButton from "@/components/splashPage/JoinButton";
import FeaturesGrid from "@/components/splashPage/FeatureSection";

const SplashPage = () => {
  return (
    <SplashLayout>
      <div className="bg-slate-900 relative">
        {/* SVG Background Overlays */}
        <svg
          width="100%"
          height="50%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute top-0 left-0 z-0"
          style={{ opacity: 0.3 }}
        >
          <polygon points="0,0 60,0 0,100" fill="#1f2937" />
        </svg>

        {/* Main Content Container */}
        <div className="flex flex-col lg:flex-row text-white p-8 relative z-10 min-h-[60vh]">
          {/* Text/Feature Section */}
          <div className="w-full lg:w-1/2 flex flex-col items-start space-y-12">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 dark:text-white">
              Your AI-Powered Student Assistant
            </h1>
            <p className="mt-4 text-base md:text-2xl text-gray-700 dark:text-gray-200 leading-relaxed">
              PolyLink leverages{" "}
              <strong className="font-extrabold text-gray-900 dark:text-white">
                AI
              </strong>{" "}
              to make your academic journey{" "}
              <strong className="font-bold text-gray-900 dark:text-white">
                easier, smarter, and more personalized.
              </strong>
            </p>

            <FeaturesGrid />

            {/* More Prominent Action Button */}
            <JoinButton />
          </div>

          {/* YouTube Video Section */}
          <div className="lg:w-1/2 mt-6 lg:mt-0 flex justify-center items-center">
            <iframe
              className="w-full aspect-video max-w-[800px] rounded-lg shadow-lg"
              src="https://www.youtube.com/embed/kjRg9rggu_M?si=JLMqb9UMHdnn1GIL"
              title="YouTube demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Separator */}
        <div className="flex flex-col border-t border-zinc-800 text-start text-gray-400"></div>
        <div className="flex flex-col border-t border-zinc-800 text-center text-gray-400 relative">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute top-0 left-0 z-0"
            style={{ opacity: 0.1 }}
          >
            <polygon points="0,0 30,0 0,100" fill="#1f2937" />
          </svg>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute top-0 right-0 z-0"
            style={{ opacity: 0.2 }}
          >
            <polygon points="100,0 100,100 50,100" fill="#1f2937" />
          </svg>
        </div>
        <StickyScrollRevealDemo />
        {/* Border */}
        <div className="flex flex-col border-t border-zinc-800 text-center text-gray-400"></div>
        <Hero />
      </div>
    </SplashLayout>
  );
};

export default SplashPage;
