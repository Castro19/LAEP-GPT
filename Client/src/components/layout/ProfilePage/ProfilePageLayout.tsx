import { ReactNode } from "react";

// My components
import MobileHeader from "@/components/layout/MobileHeader";
import DragDropContextWrapper from "@/components/layout/DragDropContxtWrapper";
import ProfilePageHeader from "@/components/layout/ProfilePage/ProfilePageHeader";
import OuterSidebar from "@/components/layout/OuterIconSidebar";

// UI Components
import { ScrollArea } from "@/components/ui/scroll-area";

// Hooks
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";

type ProfilePageLayoutProps = {
  children: ReactNode;
};
const ProfilePageLayout = ({ children }: ProfilePageLayoutProps) => {
  const isMobile = useIsNarrowScreen();

  return (
    <div className="min-h-screen">
      <div className="flex">
        {isMobile ? null : <OuterSidebar />}
        <DragDropContextWrapper>
          <div className="bg-slate-800 text-white min-h-screen flex flex-col no-scroll w-full oveflow-hidden">
            {isMobile ? <MobileHeader /> : <ProfilePageHeader />}
            <ScrollArea className="overflow-y-auto">
              <div className="flex-1 h-[95vh]">{children}</div>
            </ScrollArea>
          </div>
        </DragDropContextWrapper>
      </div>
    </div>
  );
};

export default ProfilePageLayout;
