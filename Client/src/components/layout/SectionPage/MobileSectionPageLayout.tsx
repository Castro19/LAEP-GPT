import React from "react";
import MobileHeader from "../MobileHeader";

const MobileSectionPageLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <MobileHeader />
      <div className="flex-1 bg-slate-900 text-white">{children}</div>
    </div>
  );
};

export default MobileSectionPageLayout;
