import { ReactNode } from "react";

interface ChatPageLayoutProps {
  children: ReactNode;
}

const ChatPageLayout = ({ children }: ChatPageLayoutProps) => {
  return <div>{children}</div>;
};

export default ChatPageLayout;
