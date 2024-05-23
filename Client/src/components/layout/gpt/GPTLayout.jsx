import React from "react";
import GPTHeader from "./GPTHeader";
import { useSelector } from "react-redux";
import { Toaster } from "@/components/ui/toaster";
const GPTLayout = ({ children }) => {
  const isSidebarVisible = useSelector(
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
      <Toaster />
    </div>
  );
};

export default GPTLayout;
