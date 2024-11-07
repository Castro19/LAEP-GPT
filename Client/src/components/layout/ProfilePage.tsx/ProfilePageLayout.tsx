import { ReactNode } from "react";
import ProfilePageHeader from "./ProfilePageHeader";

type ProfilePageLayoutProps = {
  children: ReactNode;
};
const ProfilePageLayout = ({ children }: ProfilePageLayoutProps) => {
  return (
    <div className="dark:bg-slate-800 min-h-screen">
      <ProfilePageHeader />
      {children}
    </div>
  );
};

export default ProfilePageLayout;
