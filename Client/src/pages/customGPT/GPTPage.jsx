import React from "react";
import GPTContainer from "../../components/customGPT/GPTContainer/GPTContainer";
import GPTHeader from "../../components/customGPT/GPTHeader/GPTHeader";
// Redux:
import { useSelector } from "react-redux";

const GPTPage = () => {
  const isSidebarVisible = useSelector(
    (state) => state.layout.isSidebarVisible
  );

  return (
    <div
      className={`dark:bg-gray-800 dark:text-white min-h-screen p-4 transition-all duration-300 ${
        isSidebarVisible ? "ml-64" : ""
      }`}
    >
      {" "}
      <GPTHeader />
      <GPTContainer />
    </div>
  );
};

export default GPTPage;
