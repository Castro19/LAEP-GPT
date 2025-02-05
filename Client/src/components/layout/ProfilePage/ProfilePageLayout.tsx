import { ReactNode } from "react";
import ProfilePageHeader from "./ProfilePageHeader";

import DragDropContextWrapper from "../DragDropContxtWrapper";
import OuterSidebar from "../OuterIconSidebar";

type ProfilePageLayoutProps = {
  children: ReactNode;
};
const ProfilePageLayout = ({ children }: ProfilePageLayoutProps) => {
  return (
    <div className="min-h-screen">
      <div className="flex">
        <OuterSidebar />
        <DragDropContextWrapper>
          <div className="bg-slate-800 text-white min-h-screen flex flex-col no-scroll w-full">
            <ProfilePageHeader />
            <div className="flex-1 overflow-auto">{children}</div>
          </div>
        </DragDropContextWrapper>
      </div>
    </div>
  );
};

export default ProfilePageLayout;
