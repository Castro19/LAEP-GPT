import useIsMobile from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { useState } from "react";

const SplashHeader = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = (path: string) => {
    console.log("clicked", path);
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 bg-slate-900 text-white p-4 z-50 border-b-2 border-zinc-800 dark:border-x-gray-500 shadow-md">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="text-3xl hover:text-gray-300"
        >
          PolyLink
        </button>

        {isMobile ? (
          <>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-4xl hover:text-gray-300"
            >
              <RxHamburgerMenu />
            </button>

            {/* Mobile Menu Overlay */}
            <div
              className={`absolute top-full left-0 right-0 bg-slate-900 border-b-2 border-zinc-800 transform transition-all duration-300 ease-in-out ${
                isMenuOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              <div className="flex flex-col p-4 space-y-4">
                <button
                  onClick={() => handleLinkClick("/coming-soon")}
                  className="text-lg hover:text-gray-300 text-left transform transition-transform duration-200 hover:translate-x-2"
                >
                  Engineering
                </button>
                <button
                  onClick={() => handleLinkClick("/coming-soon")}
                  className="text-lg hover:text-gray-300 text-left transform transition-transform duration-200 hover:translate-x-2"
                >
                  About
                </button>
                <button
                  onClick={() => handleLinkClick("/coming-soon")}
                  className="text-lg hover:text-gray-300 text-left transform transition-transform duration-200 hover:translate-x-2"
                >
                  FAQ
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-12 mr-6">
            <button
              onClick={() => handleLinkClick("/coming-soon")}
              className="text-lg hover:text-gray-300"
            >
              Engineering
            </button>
            <button
              onClick={() => handleLinkClick("/coming-soon")}
              className="text-lg hover:text-gray-300"
            >
              About
            </button>
            <button className="text-lg hover:text-gray-300">FAQ</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default SplashHeader;
