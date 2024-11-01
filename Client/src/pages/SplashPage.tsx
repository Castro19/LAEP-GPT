import { Hero } from "@/components/splashPage/Hero";
import { StickyScrollRevealDemo } from "@/components/splashPage/MatchingFeatures";
import SplashFooter from "@/components/splashPage/SplashFooter";
import SplashHeader from "@/components/splashPage/SplashHeader";
import { useNavigate } from "react-router-dom";

const SplashPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <SplashHeader />

      <div className="bg-slate-900 min-h-screen relative">
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
          <div className="md:w-1/2 flex flex-col items-start space-y-4">
            <h1 className="text-4xl font-bold leading-tight">
              PolyLink: Your Personalized AI Advisor at Cal Poly
            </h1>
            <p className="text-lg mt-4">
              Welcome to PolyLink, a cutting-edge AI assistant designed to help
              Cal Poly students make the most of their academic journey.
              <br />
              <br />
              Whether you’re seeking an advisor, exploring classes, joining
              clubs, or connecting with study partners, PolyLink leverages
              advanced AI to offer personalized recommendations tailored to your
              goals and interests.
              <br />
              <br />
              Sign in with your Cal Poly account to start exploring a wealth of
              resources and connections curated for you.
            </p>
            <button
              className="bg-green-600 text-white px-4 py-2 mt-6 rounded hover:bg-green-700"
              onClick={() => navigate("/login")}
            >
              Log In
            </button>
          </div>
          {/* Image Section */}
          <div className="md:w-1/2 mt-6 md:mt-0 flex justify-center items-center">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow-lg"
            ></iframe>
          </div>
        </div>

        <div className="flex flex-col border-t border-zinc-800 text-center text-gray-400"></div>

        <StickyScrollRevealDemo />
        {/* <WobbleCardDemo /> */}
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
      <SplashFooter />
    </>
  );
};

export default SplashPage;
