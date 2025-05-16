import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";
import { useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";

import SplashHeaderButton from "@/components/splashPage/SplashHeaderButton";
import { IoIosInformationCircleOutline } from "react-icons/io";

const SplashHeader = () => {
  const navigate = useNavigate();
  const isNarrowScreen = useIsNarrowScreen();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleGithubClick = (path: string) => {
    window.open(path, "_blank");
  };

  const mobileMenuStyles =
    "text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-white to-blue-100 font-bold tracking-wide drop-shadow-[0_1.2px_1.2px_rgba(0,204,255,0.3)] transition-all duration-300 hover:drop-shadow-[0_1.2px_1.2px_rgba(0,204,255,0.5)]";
  const menuStyles =
    "text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-white to-blue-100 font-bold tracking-wide drop-shadow-[0_1.2px_1.2px_rgba(0,204,255,0.3)] transition-all duration-300 hover:drop-shadow-[0_1.2px_1.2px_rgba(0,204,255,0.5)]";

  return (
    <header className="sticky top-0 bg-slate-900 text-white p-4 z-50 border-b-2  border-zinc-800 dark:border-x-gray-500 shadow-md">
      <div className="flex items-center justify-between">
        <SplashHeaderButton />
        {isNarrowScreen ? (
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
              <div className="flex flex-col p-4 space-y-4 ">
                <button
                  onClick={() => handleLinkClick("/team")}
                  className={mobileMenuStyles}
                >
                  Our Team
                </button>
                <Button
                  onClick={() =>
                    handleGithubClick("https://github.com/Castro19/LAEP-GPT")
                  }
                  className={mobileMenuStyles}
                >
                  <div className="flex items-center space-x-2">
                    <p className="text-white">Github</p>
                    <FaGithub className="size-5 text-white" />
                  </div>
                </Button>
                <Button
                  onClick={() => handleLinkClick("/about")}
                  className={mobileMenuStyles}
                >
                  <div className="flex items-center space-x-2">
                    <p className="text-white font-bold">About</p>
                    <IoIosInformationCircleOutline className="size-5 text-white" />
                  </div>
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-2 mr-2">
            <Button
              onClick={() =>
                handleGithubClick("https://github.com/Castro19/LAEP-GPT")
              }
              className={menuStyles}
            >
              <FaGithub className="size-8 text-white" />
            </Button>
            <Button
              onClick={() => handleLinkClick("/team")}
              className={menuStyles}
            >
              <p className="text-white font-bold text-xl">Our Team</p>
            </Button>
            <Button
              onClick={() => handleLinkClick("/about")}
              className={menuStyles}
            >
              <p className="text-white font-bold text-xl">About</p>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default SplashHeader;
