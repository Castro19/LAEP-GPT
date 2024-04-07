import React, { useState, useContext, createContext } from "react";
const ModelContext = createContext();

export const ModelProvider = ({ children }) => {
  // Set The Model type for the ChatBot, 3 versions:
  // Normal Mode('normal'),
  // Senior Project Ethical Advisor('Ethical'),
  // Advisor Matching ('match')
  const [modelType, setModelType] = useState("normal");

  return (
    <ModelContext.Provider
      value={{
        modelType,
        setModelType,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
};

export const useModel = () => useContext(ModelContext);
