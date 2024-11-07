import GPTHeader from "./GPTHeader";
import { ReactNode } from "react";
import { useAppSelector } from "@/redux";

type GPTLayoutProps = {
  children: ReactNode;
};
const GPTLayout = ({ children }: GPTLayoutProps) => {
  const isSidebarVisible = useAppSelector(
    (state) => state.layout.isSidebarVisible
  );

  return (
    <div
      className={`dark:bg-gray-800 dark:text-white min-h-screen p-4 transition-all duration-30 ${
        isSidebarVisible ? "ml-64" : ""
      }`}
    >
      <GPTHeader />
      <div>{children}</div>
    </div>
  );
};

export default GPTLayout;
