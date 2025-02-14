import { ReactNode } from "react";
import ProfilePageHeader from "./ProfilePageHeader";

import DragDropContextWrapper from "../DragDropContxtWrapper";
import OuterSidebar from "../OuterIconSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import useIsMobile from "@/hooks/use-mobile";
import MobileHeader from "../MobileHeader";

type ProfilePageLayoutProps = {
  children: ReactNode;
};
const ProfilePageLayout = ({ children }: ProfilePageLayoutProps) => {
  const isMobile = useIsMobile();

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
