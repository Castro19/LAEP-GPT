import React from "react";

// My components
import MobileHeader from "@/components/layout/dynamicLayouts/MobileHeader";

type MobileSectionPageLayoutProps = {
  children: React.ReactNode;
};

const MobileSectionPageLayout = ({
  children,
}: MobileSectionPageLayoutProps) => {
  return (
    <div
      className="
        flex flex-col 
        min-h-screen 
        bg-background 
        text-white 
        w-full 
        ml-0 
        overflow-hidden 
        overscroll-none 
        touch-none
      "
      style={{
        // Prevent default scrolling on the body
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <MobileHeader />
      <div
        className="
          flex-1 
          overflow-y-auto 
          no-scrollbar 
          overscroll-contain
        "
        style={{
          // Allow scrolling within this div while hiding scrollbars
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // Internet Explorer/Edge
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default MobileSectionPageLayout;
