import { ReactNode } from "react";
import ProfilePageHeader from "./ProfilePageHeader";

import DragDropContextWrapper from "../DragDropContxtWrapper";

type ProfilePageLayoutProps = {
  children: ReactNode;
};
const ProfilePageLayout = ({ children }: ProfilePageLayoutProps) => {
  return (
    <DragDropContextWrapper>
      <div className="dark:bg-slate-800 min-h-screen">
        <ProfilePageHeader />
        {children}
      </div>
    </DragDropContextWrapper>
  );
};

export default ProfilePageLayout;
