import { createContext, useState,useContext } from "react";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [guide, setGuide] = useState(null);
  const [guideData, setGuideData] = useState(null);

  return <Context.Provider value={{ guide, setGuide, guideData, setGuideData }}>{children}</Context.Provider>;
};
export const useCustomContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useCustomContext must be used within a ContextProvider");
  }
  return context;
};
