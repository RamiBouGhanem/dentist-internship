// src/context/ToothDataContext.js
import { createContext, useContext, useState } from "react";

const ToothContext = createContext();

export function ToothProvider({ children }) {
  const [toothData, setToothData] = useState({});

  const updateTooth = (number, procedures) => {
    setToothData(prev => ({ ...prev, [number]: procedures }));
  };

  return (
    <ToothContext.Provider value={{ toothData, updateTooth }}>
      {children}
    </ToothContext.Provider>
  );
}

export const useToothData = () => useContext(ToothContext);
