import { ReactNode } from "react";
// import { Toaster } from "@/components/ui/toaster";

interface ChatPageLayoutProps {
  children: ReactNode;
}

const ChatPageLayout = ({ children }: ChatPageLayoutProps) => {
  return (
    <html lang="en">
      <head />
      <body>
        <main>{children}</main>
        {/* <Toaster /> */}
      </body>
    </html>
  );
};

export default ChatPageLayout;
