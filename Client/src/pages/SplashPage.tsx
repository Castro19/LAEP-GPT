import { Hero } from "@/components/splashPage/Hero";
import { StickyScrollRevealDemo } from "@/components/splashPage/MatchingFeatures";
import { useNavigate } from "react-router-dom";
import SplashLayout from "@/components/layout/splashPage/SplashLayout";
import SpecialButton from "@/components/ui/specialButton";

const SplashPage = () => {
  const navigate = useNavigate();

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
        <div className="flex flex-col md:flex-row text-white p-8 relative z-10">
          <div className="md:w-1/2 flex flex-col items-start space-y-6">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-gray-900 dark:text-white">
              Your AI-Powered Student Assistant
            </h1>
            <p className="mt-4 text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              PolyLink leverages{" "}
              <strong className="font-bold text-gray-900 dark:text-white">
                AI
              </strong>{" "}
              to make your academic journey{" "}
              <strong className="font-bold text-gray-900 dark:text-white">
                easier, smarter, and more personalized.
              </strong>
            </p>
            <div className="mt-6 space-y-3 text-base md:text-lg">
              {/* Feature 1 */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center lg:space-x-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🚀</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-lg lg:whitespace-nowrap">
                    Find Classes Instantly
                  </span>
                </div>
                <p className="mt-2 lg:mt-0 text-base text-gray-700 dark:text-gray-300">
                  – AI-powered search helps you discover the best Spring 2025
                  courses.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center lg:space-x-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">📅</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-lg lg:whitespace-nowrap">
                    Effortless Schedule Building
                  </span>
                </div>
                <p className="text-base text-gray-700 dark:text-gray-300">
                  – Generate, customize, and optimize your weekly schedule.
                </p>
              </div>
              {/* Feature 3 */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center lg:space-x-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🤖</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-lg lg:whitespace-nowrap">
                    Smart AI Insights
                  </span>
                </div>
                <p className="mt-2 lg:mt-0 text-base text-gray-700 dark:text-gray-300">
                  – Get schedule summaries, professor ratings, and personalized
                  recommendations.
                </p>
              </div>
            </div>
            <SpecialButton
              text="Log In"
              onClick={() => navigate("/register/login")}
              className="w-[120px] text-white text-lg font-semibold px-5 py-3 mt-6 rounded-xl bg-green-600 hover:bg-green-700 transition duration-300"
              icon={<></>}
            />
          </div>

          {/* Image Section */}
          <div className="md:w-1/2 mt-6 md:mt-0 flex justify-center items-center">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/kjRg9rggu_M?si=JLMqb9UMHdnn1GIL"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow-lg"
            ></iframe>
          </div>
        </div>

        <div className="flex flex-col border-t border-zinc-800 text-center text-gray-400"></div>

        <StickyScrollRevealDemo />
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

          <Hero />
        </div>
      </div>
    </SplashLayout>
  );
};

export default SplashPage;
