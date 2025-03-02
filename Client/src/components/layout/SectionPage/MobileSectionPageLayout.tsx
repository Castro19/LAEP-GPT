import React from "react";
import MobileHeader from "../MobileHeader";

const MobileSectionPageLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col h-screen overflow-none no-scroll safe-bottom-inset mt-12">
      {/* Fixed header */}
      <MobileHeader />

      {/* Scrollable content area */}
      <div className="flex-1 bg-slate-900 text-white overflow-none no-scroll">
        {children}
      </div>

      {/* Fixed footer */}
      <MobileFooter />
    </div>
  );
};

const MobileFooter = () => {
  return (
    <footer className="bg-slate-900 text-white safe-bottom-inset border-t border-slate-800 fixed bottom-0 left-0 right-0">
      <div className="flex justify-between p-4">
        <div>Left</div>
        <div>Right</div>
      </div>
    </footer>
  );
};

export default MobileSectionPageLayout;
