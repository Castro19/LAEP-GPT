import { ReactNode } from "react";

// My components
import MobileHeader from "@/components/layout/dynamicLayouts/MobileHeader";
import DragDropContextWrapper from "@/components/layout/dnd/DragDropContextWrapper";
import ProfilePageHeader from "@/components/layout/ProfilePage/ProfilePageHeader";
import OuterIconSidebar from "@/components/layout/dynamicLayouts/OuterIconSidebar";

// UI Components
import { ScrollArea } from "@/components/ui/scroll-area";

// Hooks
import useIsNarrowScreen from "@/hooks/useIsNarrowScreen";

type ProfilePageLayoutProps = {
  children: ReactNode;
};
const ProfilePageLayout = ({ children }: ProfilePageLayoutProps) => {
  const isNarrowScreen = useIsNarrowScreen();

  return (
    <div className="min-h-screen">
      <div className="flex">
        {isNarrowScreen ? null : <OuterIconSidebar />}
        <DragDropContextWrapper>
          <div className="bg-card text-white min-h-screen flex flex-col no-scroll w-full oveflow-hidden">
            {isNarrowScreen ? <MobileHeader /> : <ProfilePageHeader />}
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
