import React, { useState, useContext, createContext } from "react";
const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(0);
  const [isNewChat, setIsNewChat] = useState(true);

  return (
    <UIContext.Provider
      value={{
        isSidebarVisible,
        setIsSidebarVisible,
        currentChatId,
        setCurrentChatId,
        isNewChat,
        setIsNewChat,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
