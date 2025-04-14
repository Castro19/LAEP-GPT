import React from "react";
import TitleCard from "@/components/register/TitleCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface MobileSignInFlowProps {
  title: string;
  description: string;
  currentStepIndex: number;
  isTermsAccepted: boolean;
  handleNext: () => void;
  handlePrevious: () => void;
  handleDisableClick: () => void;
  handleCompleteProfile: () => void;
  signInFlowSteps: string[];
  children: React.ReactNode;
}

const MobileSignInFlow: React.FC<MobileSignInFlowProps> = ({
  title,
  description,
  currentStepIndex,
  isTermsAccepted,
  handleNext,
  handlePrevious,
  handleDisableClick,
  handleCompleteProfile,
  signInFlowSteps,
  children,
}) => {
  return (
    <div
      className="relative flex flex-col min-h-screen bg-slate-900"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Subtle background shapes, absolutely positioned */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none select-none overflow-hidden">
        <svg
          className="absolute w-[380px] h-[380px] text-slate-600 opacity-10 top-[-120px] left-[-120px]"
          fill="currentColor"
          viewBox="0 0 512 512"
        >
          <polygon points="0,0 512,0 0,512" />
        </svg>
        <svg
          className="absolute w-[540px] h-[540px] text-slate-700 opacity-10 bottom-[-200px] right-[-180px] rotate-45"
          fill="currentColor"
          viewBox="0 0 512 512"
        >
          <rect width="512" height="512" rx="80" ry="80" />
        </svg>
      </div>

      {/* Header at the top (optionally sticky if desired) */}
      <header className="z-10">
        <TitleCard title={title} description={description} />
      </header>

      {/**
       * The main area:
       * flex-1 so it expands vertically.
       * We wrap children in a scrollable area, so the user can scroll
       * if the content is too large.
       */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-md flex-1 overflow-auto bg-gradient-to-br from-zinc-800/95 via-zinc-800 to-slate-800 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-white">
          <ScrollArea>{children}</ScrollArea>
        </div>
      </main>

      {/**
       * Footer container:
       * - sticky bottom-0 pins it to the bottom even if scrolled.
       * - we apply safe-area + base padding via calc().
       */}
      <footer
        className="z-10 sticky bottom-0 border-t border-slate-600/50
                   bg-gradient-to-br from-zinc-800/95 via-zinc-800 to-slate-800
                   dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
                   flex items-center justify-center px-4 py-3"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)",
        }}
      >
        <div className="w-full max-w-md flex justify-between">
          {/* Previous Button */}
          <div>
            {currentStepIndex > 0 && (
              <button
                onClick={handlePrevious}
                className="flex items-center px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md border border-slate-600/50 transition-all duration-200 text-sm"
              >
                <FaArrowLeft className="mr-2" />
                Back
              </button>
            )}
          </div>

          {/* Next or Finish */}
          <div>
            {currentStepIndex < signInFlowSteps.length - 1 ? (
              isTermsAccepted ? (
                <button
                  onClick={handleNext}
                  className="flex items-center px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md border border-slate-600/50 transition-all duration-200 text-sm"
                >
                  Next
                  <FaArrowRight className="ml-2" />
                </button>
              ) : (
                <Button
                  onClick={handleDisableClick}
                  variant="destructive"
                  className="bg-red-900/80 hover:bg-red-900 text-white border border-red-800/50 text-sm"
                >
                  Disabled
                </Button>
              )
            ) : isTermsAccepted ? (
              <button
                onClick={handleCompleteProfile}
                className="px-3 py-2 rounded-md border transition-all duration-200 bg-green-900/80 hover:bg-green-900 border-green-800/50 text-white text-sm"
              >
                Finish
              </button>
            ) : (
              <Button
                onClick={handleDisableClick}
                variant="destructive"
                className="bg-red-900/80 hover:bg-red-900 text-white border border-red-800/50 text-sm"
              >
                Disabled
              </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MobileSignInFlow;
