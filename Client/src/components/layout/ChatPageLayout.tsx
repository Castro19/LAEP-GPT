import { ReactNode } from "react";
// import { Toaster } from "@/components/ui/toaster";

interface ChatPageLayoutProps {
  children: ReactNode;
}

const ChatPageLayout = ({ children }: ChatPageLayoutProps) => {
  return (
    <div>
      <main>{children}</main>
      {/* <Toaster /> */}
    </div>
  );
};

export default ChatPageLayout;
